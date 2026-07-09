import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (token, onNewMessage, onMessageDeleted, onMessageStatusUpdate) => {
  const socketRef = useRef(null);
  const [onlineStatuses, setOnlineStatuses] = useState({});
  const [typingStates, setTypingStates] = useState({});
  const [incomingCall, setIncomingCall] = useState(null);
  const [callState, setCallState] = useState("disconnected"); // disconnected, ringing, connected

  // Keep latest callbacks in mutable refs to avoid socket reconnect loops
  const onNewMessageRef = useRef(onNewMessage);
  const onMessageDeletedRef = useRef(onMessageDeleted);
  const onMessageStatusUpdateRef = useRef(onMessageStatusUpdate);

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
    onMessageDeletedRef.current = onMessageDeleted;
    onMessageStatusUpdateRef.current = onMessageStatusUpdate;
  });

  useEffect(() => {
    if (!token) return;

    // Connect to backend Socket server (exactly once per token mount/change)
    const socket = io("http://localhost:3000", {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to NexChat Socket server!");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // Listen for status changes of other users
    socket.on("user_status_changed", ({ userId, status }) => {
      setOnlineStatuses(prev => ({ ...prev, [userId]: status === "online" }));
    });

    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      onNewMessageRef.current?.(message);
    });

    socket.on("message_sent_ack", (message) => {
      onNewMessageRef.current?.(message);
    });

    socket.on("message_status_update", ({ messageId, status }) => {
      onMessageStatusUpdateRef.current?.(messageId, status);
    });

    socket.on("messages_read_receipt", ({ readerId }) => {
      console.log(`User ${readerId} read my messages`);
    });

    // Listen for deleted messages
    socket.on("message_deleted", ({ messageId, senderId }) => {
      onMessageDeletedRef.current?.(messageId, senderId);
    });

    // Listen for typing signals
    socket.on("typing_status", ({ senderId, isTyping }) => {
      setTypingStates(prev => ({ ...prev, [senderId]: isTyping }));
    });

    // Listen for calling events
    socket.on("incoming_call", ({ senderId, senderName, senderAvatar, type }) => {
      setIncomingCall({ senderId, senderName, senderAvatar, type });
      setCallState("ringing");
    });

    socket.on("call_connected", () => {
      setCallState("connected");
    });

    socket.on("call_denied", () => {
      setCallState("disconnected");
      setIncomingCall(null);
    });

    socket.on("call_terminated", () => {
      setCallState("disconnected");
      setIncomingCall(null);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]); // ONLY reconnect if token changes!

  // EMIT EVENT WRAPPERS
  const sendMessage = (receiverId, text, type = "text", mediaUrl = null) => {
    socketRef.current?.emit("send_message", { receiverId, text, type, mediaUrl });
  };

  const markAsRead = (senderId) => {
    socketRef.current?.emit("mark_as_read", { senderId });
  };

  const deleteMessage = (messageId, receiverId) => {
    socketRef.current?.emit("delete_message", { messageId, receiverId });
  };

  const emitTyping = (receiverId, isTyping) => {
    socketRef.current?.emit("typing", { receiverId, isTyping });
  };

  const emitCallUser = (receiverId, type) => {
    socketRef.current?.emit("call_user", { receiverId, type });
    setCallState("ringing");
  };

  const emitCallAccepted = (receiverId) => {
    socketRef.current?.emit("call_accepted", { receiverId });
    setCallState("connected");
  };

  const emitCallRejected = (receiverId) => {
    socketRef.current?.emit("call_rejected", { receiverId });
    setCallState("disconnected");
    setIncomingCall(null);
  };

  const emitEndCall = (receiverId) => {
    socketRef.current?.emit("end_call", { receiverId });
    setCallState("disconnected");
    setIncomingCall(null);
  };

  const clearIncomingCall = () => {
    setIncomingCall(null);
    setCallState("disconnected");
  };

  return {
    socket: socketRef.current,
    onlineStatuses,
    typingStates,
    incomingCall,
    callState,
    setCallState,
    sendMessage,
    markAsRead,
    deleteMessage,
    emitTyping,
    emitCallUser,
    emitCallAccepted,
    emitCallRejected,
    emitEndCall,
    clearIncomingCall
  };
};

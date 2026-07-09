import React, { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({
  activeChatMessages,
  myId,
  isContactTyping,
  handleDeleteMessage,
  setShowAttachmentMenu,
  setShowEmojiPicker
}) => {
  const messageEndRef = useRef(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatMessages, isContactTyping]);

  return (
    <div 
      className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-app-bg relative"
      onClick={() => {
        setShowAttachmentMenu(false);
        setShowEmojiPicker(false);
      }}
    >
      {activeChatMessages.map((msg) => {
        const msgSenderId = msg.sender?._id || msg.sender || "";
        const isMe = msgSenderId === myId || msg.senderId === "me" || msg.sender === myId;
        const isSystem = msg.senderId === "system" || msg.sender === "system";
        const isDeleted = msg.type === "deleted";

        return (
          <MessageBubble
            key={msg._id || msg.id}
            msg={msg}
            isMe={isMe}
            isSystem={isSystem}
            isDeleted={isDeleted}
            hoveredMessageId={hoveredMessageId}
            setHoveredMessageId={setHoveredMessageId}
            handleDeleteMessage={handleDeleteMessage}
          />
        );
      })}

      {/* Animated Typing Indicator */}
      {isContactTyping && (
        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-app-bubble-received text-app-text rounded-2xl rounded-tl-none border border-app-border px-4 py-3 flex gap-1.5 items-center">
            <span className="w-2 h-2 rounded-full bg-app-accent animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-app-accent animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-app-accent animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;

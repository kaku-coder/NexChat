import React, { useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import SubViewPanel from "../components/dashboard/SubViewPanel";
import ChatArea from "../components/dashboard/ChatArea";
import CallOverlay from "../components/dashboard/CallOverlay";
import { useDashboard } from "../hooks/useDashboard";
import { useSocket } from "../hooks/useSocket";
import { Sparkles, PhoneCall, Mic, MicOff, Video, VideoOff, PhoneOff, Check } from "lucide-react";

const Dashboard = () => {
  const token = localStorage.getItem("token") || (() => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  })();

  // 1️⃣ Initialize Dashboard State
  const {
    user,
    loading,
    editAvatar,
    setEditAvatar,
    editName,
    setEditName,
    editBio,
    setEditBio,
    activeTab,
    setActiveTab,
    activeChatId,
    setActiveChatId,
    searchQuery,
    setSearchQuery,
    messageInput,
    setMessageInput,
    showAttachmentMenu,
    setShowAttachmentMenu,
    showEmojiPicker,
    setShowEmojiPicker,
    selectedAttachment,
    setSelectedAttachment,
    activeCall,
    setActiveCall,
    activeCallTimer,
    contacts,
    setContacts,
    conversations,
    setConversations,
    messages,
    setMessages,
    theme,
    isToastVisible,
    toastMessage,
    showToast,
    changeTheme,
    handleLogout,
    saveProfileSettings
  } = useDashboard();

  // 2️⃣ Initialize Sockets Hook
  const {
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
  } = useSocket(
    token,
    // Callback when new message is received/acknowledged
    (newMsg) => {
      console.log("📩 Socket message received:", {
        msgText: newMsg.text,
        sender: newMsg.sender,
        myId: user?._id,
        receiver: newMsg.receiver,
        isSenderMe: newMsg.sender === user?._id
      });
      const chatId = newMsg.sender === user?._id || newMsg.senderId === "me" || newMsg.sender === "me"
        ? newMsg.receiver 
        : newMsg.sender;

      console.log("🎯 Determined chatId for update:", chatId);
      if (!chatId) return;

      setMessages(prev => {
        const chatMsgs = prev[chatId] ? [...prev[chatId]] : [];
        // Prevent duplicate appending by matching unique MongoDB _ids
        if (chatMsgs.some(m => m._id && newMsg._id && m._id === newMsg._id)) {
          console.log("⚠️ Skipped duplicate message append");
          return prev;
        }
        console.log("✅ Appending message to state under chatId:", chatId);
        return { ...prev, [chatId]: [...chatMsgs, newMsg] };
      });
    },
    // Callback when message is deleted
    (deletedMsgId, senderId) => {
      const activeId = activeChatId || senderId;
      setMessages(prev => {
        if (!prev[activeId]) return prev;
        const updated = prev[activeId].map(m => {
          if (m._id === deletedMsgId || m.id === deletedMsgId) {
            return { ...m, text: "This message was deleted", type: "deleted" };
          }
          return m;
        });
        return { ...prev, [activeId]: updated };
      });
    },
    // Callback when message status is updated (sent -> delivered -> read)
    (messageId, newStatus) => {
      if (!activeChatId) return;
      setMessages(prev => {
        if (!prev[activeChatId]) return prev;
        const updated = prev[activeChatId].map(m => {
          if (m._id === messageId || m.id === messageId) {
            return { ...m, status: newStatus };
          }
          return m;
        });
        return { ...prev, [activeChatId]: updated };
      });
    }
  );

  // Mark incoming messages as read when opening a conversation
  useEffect(() => {
    if (activeChatId && token) {
      markAsRead(activeChatId);
    }
  }, [activeChatId, messages, token]);

  // Synchronize online statuses of loaded contacts dynamically
  useEffect(() => {
    if (contacts.length > 0) {
      setContacts(prev => prev.map(c => {
        const onlineState = onlineStatuses[c.id];
        if (onlineState !== undefined) {
          return { ...c, online: onlineState, status: onlineState ? "Online" : "Offline" };
        }
        return c;
      }));
    }
  }, [onlineStatuses]);

  // Handle message send trigger
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() && !selectedAttachment) return;
    if (!activeChatId) return;

    sendMessage(
      activeChatId,
      messageInput.trim(),
      selectedAttachment ? selectedAttachment.type : "text",
      selectedAttachment ? selectedAttachment.url : null
    );

    setMessageInput("");
    setSelectedAttachment(null);
    setShowAttachmentMenu(false);
  };

  // Emit typing statuses
  useEffect(() => {
    if (!activeChatId) return;
    if (messageInput.trim()) {
      emitTyping(activeChatId, true);
    } else {
      emitTyping(activeChatId, false);
    }
    return () => emitTyping(activeChatId, false);
  }, [messageInput, activeChatId]);

  // Handle message deletion
  const handleDeleteMessage = (messageId) => {
    if (!activeChatId) return;
    deleteMessage(messageId, activeChatId);
  };

  // Starting audio/video calling
  const handleStartCall = (type) => {
    const contact = contacts.find(c => c.id === activeChatId) || conversations.find(c => c.id === activeChatId);
    if (!contact) return;

    setActiveCall({ type, contact, status: "ringing" });
    emitCallUser(activeChatId, type);
  };

  // Syncing call termination
  const handleEndCall = () => {
    if (!activeCall) return;
    emitEndCall(activeCall.contact.id || activeChatId);
    setActiveCall(null);
  };

  // Sync incoming calls from socket
  useEffect(() => {
    if (incomingCall && !activeCall) {
      setActiveCall({
        type: incomingCall.type,
        contact: {
          id: incomingCall.senderId,
          name: incomingCall.senderName,
          avatar: incomingCall.senderAvatar
        },
        status: "ringing"
      });
    }
  }, [incomingCall, activeCall]);

  // Sync calling statuses
  useEffect(() => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, status: callState } : null);
    }
  }, [callState]);

  // Handle call accept/reject on incoming overlay dialogs
  const handleAcceptIncomingCall = () => {
    if (!incomingCall) return;
    emitCallAccepted(incomingCall.senderId);
    setCallState("connected");
  };

  const handleRejectIncomingCall = () => {
    if (!incomingCall) return;
    emitCallRejected(incomingCall.senderId);
    setActiveCall(null);
    clearIncomingCall();
  };

  // Alphabetical contact group calculator
  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedContacts = {};
  filteredContacts.sort((a, b) => a.name.localeCompare(b.name)).forEach(c => {
    const initial = c.name.charAt(0).toUpperCase();
    if (!groupedContacts[initial]) {
      groupedContacts[initial] = [];
    }
    groupedContacts[initial].push(c);
  });

  const activeChat = contacts.find(c => c.id === activeChatId) || conversations.find(c => c.id === activeChatId);
  const activeChatMessages = activeChatId ? (messages[activeChatId] || []) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-rose-500 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-xs tracking-widest uppercase font-semibold">Loading NexChat Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-app-bg text-app-text font-sans selection:bg-app-accent selection:text-white transition-colors duration-300 ${
      theme === "whatsapp-dark" ? "theme-whatsapp-dark" : theme === "whatsapp-light" ? "theme-whatsapp-light" : "theme-red-black"
    }`}>
      
      {/* Toast Alert */}
      {isToastVisible && (
        <div className="fixed top-6 right-6 z-50 bg-zinc-950 border border-app-accent/30 text-app-text px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-app-accent animate-pulse" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Dynamic Glow Elements for Red-Black theme */}
      {theme === "red-black" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[30%] -left-[20%] w-[60%] h-[60%] rounded-full bg-red-950/10 blur-[130px]" />
          <div className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-rose-900/10 blur-[130px]" />
        </div>
      )}

      {/* Incoming Call Popup dialog */}
      {incomingCall && callState === "ringing" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-6">
            <span className="text-xs font-bold text-app-accent uppercase tracking-wider animate-pulse">Incoming Call Signal...</span>
            <div className="relative">
              <span className="absolute -inset-2 rounded-full bg-app-accent/20 animate-ping" />
              <img 
                src={incomingCall.senderAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
                alt="avatar" 
                className="w-20 h-20 rounded-full object-cover border-2 border-app-accent"
              />
            </div>
            <div className="text-center">
              <h4 className="font-extrabold text-lg text-white">{incomingCall.senderName}</h4>
              <p className="text-xs text-zinc-400 mt-1 capitalize">wants to start a {incomingCall.type} call</p>
            </div>
            
            <div className="flex gap-4 w-full justify-center">
              <button 
                onClick={handleRejectIncomingCall}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Decline
              </button>
              <button 
                onClick={handleAcceptIncomingCall}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout Container */}
      <div className="flex h-screen overflow-hidden relative z-10">
        
        {/* Nav Toolbar Component */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setActiveChatId={setActiveChatId}
          user={user}
          handleLogout={handleLogout}
        />

        {/* Dynamic Left Drawers (Chats/Contacts/Settings lists) */}
        <SubViewPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredConversations={filteredConversations}
          typingStates={typingStates}
          groupedContacts={groupedContacts}
          startChatWithContact={(c) => {
            const existing = conversations.find(chat => chat.id === c.id);
            if (existing) {
              setActiveChatId(c.id);
              setActiveTab("chats");
            } else {
              setMessages(prev => ({ ...prev, [c.id]: [] }));
              setActiveChatId(c.id);
              setActiveTab("chats");
            }
          }}
          handleCopyInviteLink={() => {
            navigator.clipboard.writeText("https://nexchat.io/room/join-90");
            showToast("Invite room link copied to clipboard!");
          }}
          user={user}
          editAvatar={editAvatar}
          setEditAvatar={setEditAvatar}
          editName={editName}
          setEditName={setEditName}
          editBio={editBio}
          setEditBio={setEditBio}
          saveProfileSettings={saveProfileSettings}
          changeTheme={changeTheme}
          theme={theme}
        />

        {/* Messaging Area Panel */}
        <ChatArea
          activeChatId={activeChatId}
          activeChat={activeChat}
          activeChatMessages={activeChatMessages}
          conversations={conversations}
          contacts={contacts}
          typingStates={typingStates}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          showAttachmentMenu={showAttachmentMenu}
          setShowAttachmentMenu={setShowAttachmentMenu}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          selectedAttachment={selectedAttachment}
          setSelectedAttachment={setSelectedAttachment}
          handleSendMessage={handleSendMessage}
          handleDeleteMessage={handleDeleteMessage}
          handleEmojiClick={(emoji) => {
            setMessageInput(prev => prev + emoji);
            setShowEmojiPicker(false);
          }}
          startCall={handleStartCall}
          showToast={showToast}
          setActiveChatId={setActiveChatId}
          myId={user?._id || "me-id-123"}
        />

      </div>

      {/* Fullscreen Calling Overlays Dialog */}
      <CallOverlay 
        activeCall={activeCall}
        activeCallTimer={activeCallTimer}
        endCall={handleEndCall}
      />

    </div>
  );
};

export default Dashboard;

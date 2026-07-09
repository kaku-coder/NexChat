import React from "react";
import EmptyChatState from "./chat/EmptyChatState";
import ChatHeader from "./chat/ChatHeader";
import MessageList from "./chat/MessageList";
import ChatFooter from "./chat/ChatFooter";

const ChatArea = ({
  activeChatId,
  activeChat,
  activeChatMessages,
  conversations,
  contacts,
  typingStates,
  messageInput,
  setMessageInput,
  showAttachmentMenu,
  setShowAttachmentMenu,
  showEmojiPicker,
  setShowEmojiPicker,
  selectedAttachment,
  setSelectedAttachment,
  handleSendMessage,
  handleDeleteMessage,
  handleEmojiClick,
  startCall,
  showToast,
  setActiveChatId,
  myId
}) => {
  if (!activeChatId) {
    return (
      <EmptyChatState
        conversations={conversations}
        contacts={contacts}
      />
    );
  }

  const isContactTyping = typingStates[activeChatId];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-app-bg">
      {/* CHAT HEADER */}
      <ChatHeader
        activeChat={activeChat}
        isContactTyping={isContactTyping}
        startCall={startCall}
        setActiveChatId={setActiveChatId}
      />

      {/* CHAT MESSAGES SCROLL LOG */}
      <MessageList
        activeChatMessages={activeChatMessages}
        myId={myId}
        isContactTyping={isContactTyping}
        handleDeleteMessage={handleDeleteMessage}
        setShowAttachmentMenu={setShowAttachmentMenu}
        setShowEmojiPicker={setShowEmojiPicker}
      />

      {/* INPUT CONTROLS BAR */}
      <ChatFooter
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        showAttachmentMenu={showAttachmentMenu}
        setShowAttachmentMenu={setShowAttachmentMenu}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        selectedAttachment={selectedAttachment}
        setSelectedAttachment={setSelectedAttachment}
        handleSendMessage={handleSendMessage}
        handleEmojiClick={handleEmojiClick}
        showToast={showToast}
      />
    </div>
  );
};

export default ChatArea;

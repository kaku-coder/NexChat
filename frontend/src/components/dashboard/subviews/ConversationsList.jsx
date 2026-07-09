
const ConversationsList = ({
  filteredConversations,
  activeChatId,
  setActiveChatId,
  typingStates
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-2">
      {filteredConversations.length > 0 ? (
        filteredConversations.map(chat => {
          const isActive = activeChatId === chat.id;
          const isTyping = typingStates && typingStates[chat.id];
          return (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex gap-3 items-center p-3 rounded-2xl cursor-pointer transition-all mb-1 ${
                isActive 
                  ? "bg-app-accent text-white" 
                  : "hover:bg-app-hover"
              }`}
            >
              <div className="relative flex-shrink-0">
                <img 
                  src={chat.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
                  alt={chat.name} 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                {chat.online && (
                  <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-app-panel ${
                    isActive ? "bg-white" : "bg-emerald-500"
                  }`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className={`font-semibold text-sm truncate ${isActive ? "text-white" : "text-app-text"}`}>{chat.name}</h4>
                  <span className={`text-[10px] ${isActive ? "text-red-200" : "text-app-muted"}`}>{chat.timestamp}</span>
                </div>
                <p className={`text-xs truncate ${isActive ? "text-red-100" : "text-app-muted"}`}>
                  {isTyping ? (
                    <span className={`font-medium italic ${isActive ? "text-white animate-pulse" : "text-app-accent animate-pulse"}`}>Typing...</span>
                  ) : (
                    chat.lastMessage
                  )}
                </p>
              </div>

              {chat.unreadCount > 0 && !isActive && (
                <div className="bg-app-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-5 text-center flex-shrink-0">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <p className="text-app-muted text-sm font-light">No conversations found</p>
        </div>
      )}
    </div>
  );
};

export default ConversationsList;

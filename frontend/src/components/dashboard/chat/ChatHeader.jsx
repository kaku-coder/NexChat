import React from "react";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = ({
  activeChat,
  isContactTyping,
  startCall,
  setActiveChatId
}) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-app-panel border-b border-app-border flex-shrink-0 z-20 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        {/* Back button (Mobile view only) */}
        <button 
          onClick={() => setActiveChatId(null)}
          className="p-1.5 -ml-1 rounded-lg text-app-muted hover:bg-app-hover hover:text-app-text md:hidden cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <img 
          src={activeChat.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
          alt={activeChat.name} 
          className="w-10 h-10 rounded-full object-cover flex-shrink-0" 
        />
        <div className="min-w-0">
          <h3 className="font-bold text-sm text-app-text truncate leading-tight">{activeChat.name}</h3>
          <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            {isContactTyping ? "typing..." : (activeChat.online ? "Online" : "Offline")}
          </span>
        </div>
      </div>

      {/* Call actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => startCall("voice")}
          className="p-2.5 rounded-xl bg-app-hover text-app-text hover:text-app-accent hover:bg-app-accent/10 transition-all cursor-pointer"
          title="Audio call"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button 
          onClick={() => startCall("video")}
          className="p-2.5 rounded-xl bg-app-hover text-app-text hover:text-app-accent hover:bg-app-accent/10 transition-all cursor-pointer"
          title="Video call"
        >
          <Video className="w-4 h-4" />
        </button>
        <button className="p-2.5 rounded-xl bg-app-hover text-app-text hover:bg-app-hover/80 transition-all cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;

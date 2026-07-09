import React from "react";
import { MessageSquare } from "lucide-react";

const EmptyChatState = ({ conversations, contacts }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-app-bg select-none">
      <div className="max-w-md flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="p-6 bg-app-panel rounded-3xl border border-app-border text-app-accent shadow-2xl relative">
          <MessageSquare className="w-16 h-16" />
          <span className="absolute -top-2 -right-2 bg-emerald-500 w-5 h-5 rounded-full border-4 border-app-bg" />
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-app-text mb-2">NexChat Console</h3>
          <p className="text-app-muted text-sm font-light leading-relaxed">
            Select a conversation from the Messages list or search your contacts to initiate a secure end-to-end encrypted session.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 w-full mt-4">
          <div className="bg-app-panel border border-app-border p-3.5 rounded-2xl">
            <span className="block text-xl font-bold text-app-text">{conversations.length}</span>
            <span className="text-[10px] text-app-muted uppercase tracking-wider font-semibold">Chats</span>
          </div>
          <div className="bg-app-panel border border-app-border p-3.5 rounded-2xl">
            <span className="block text-xl font-bold text-emerald-500">Online</span>
            <span className="text-[10px] text-app-muted uppercase tracking-wider font-semibold">Server</span>
          </div>
          <div className="bg-app-panel border border-app-border p-3.5 rounded-2xl">
            <span className="block text-xl font-bold text-app-text">{contacts.length}</span>
            <span className="text-[10px] text-app-muted uppercase tracking-wider font-semibold">Contacts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatState;

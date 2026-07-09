import React from "react";
import { MessageSquare, Users, Settings, LogOut } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, setActiveChatId, user, handleLogout }) => {
  return (
    <nav className="w-16 flex flex-col justify-between items-center py-6 bg-app-panel border-r border-app-border flex-shrink-0 z-20">
      {/* Top Logo */}
      <div className="flex flex-col gap-6 items-center">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-app-accent to-red-400 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-app-accent/20">
          N
        </div>
        
        {/* View selectors */}
        <div className="flex flex-col gap-3 mt-4">
          <button 
            onClick={() => { setActiveTab("chats"); setActiveChatId(null); }}
            className={`p-3.5 rounded-xl transition-all cursor-pointer relative group ${
              activeTab === "chats" ? "bg-app-accent text-white" : "text-app-muted hover:bg-app-hover hover:text-app-text"
            }`}
            title="Chats"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute left-18 bg-zinc-950 border border-zinc-800 text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity font-semibold z-30">
              Chats
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab("contacts"); }}
            className={`p-3.5 rounded-xl transition-all cursor-pointer relative group ${
              activeTab === "contacts" ? "bg-app-accent text-white" : "text-app-muted hover:bg-app-hover hover:text-app-text"
            }`}
            title="Contacts"
          >
            <Users className="w-5 h-5" />
            <span className="absolute left-18 bg-zinc-950 border border-zinc-800 text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity font-semibold z-30">
              Contacts
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab("settings"); }}
            className={`p-3.5 rounded-xl transition-all cursor-pointer relative group ${
              activeTab === "settings" ? "bg-app-accent text-white" : "text-app-muted hover:bg-app-hover hover:text-app-text"
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
            <span className="absolute left-18 bg-zinc-950 border border-zinc-800 text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity font-semibold z-30">
              Settings
            </span>
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-4 items-center">
        <img 
          src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
          alt="user avatar" 
          className="w-9 h-9 rounded-full object-cover border border-app-border cursor-pointer hover:border-app-accent transition-all"
          onClick={() => setActiveTab("settings")}
        />
        <button 
          onClick={handleLogout}
          className="p-3.5 rounded-xl text-app-muted hover:bg-red-950/20 hover:text-red-400 transition-all cursor-pointer"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;

import React from "react";
import { Camera } from "lucide-react";

const SettingsPanel = ({
  user,
  editAvatar,
  setEditAvatar,
  editName,
  setEditName,
  editBio,
  setEditBio,
  saveProfileSettings,
  changeTheme,
  theme
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-5">
      <form onSubmit={saveProfileSettings} className="flex flex-col gap-6 py-2">
        {/* Photo Display */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative group">
            <img 
              src={editAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
              alt="Profile Avatar" 
              className="w-24 h-24 rounded-full object-cover border-2 border-app-border group-hover:border-app-accent transition-colors" 
            />
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-[10px] text-app-muted uppercase tracking-wider font-semibold">Connected Profile</span>
        </div>

        {/* Edit Username */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-app-muted font-bold uppercase tracking-wider">Username</label>
          <input 
            type="text" 
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-app-bg text-app-text border border-app-border rounded-xl focus:outline-none focus:border-app-accent transition-colors"
          />
        </div>

        {/* Edit Bio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-app-muted font-bold uppercase tracking-wider">Status Bio</label>
          <input 
            type="text" 
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-app-bg text-app-text border border-app-border rounded-xl focus:outline-none focus:border-app-accent transition-colors"
          />
        </div>

        {/* Edit Avatar Link */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-app-muted font-bold uppercase tracking-wider">Avatar Image URL</label>
          <input 
            type="text" 
            value={editAvatar}
            placeholder="https://unsplash.com/your-image"
            onChange={(e) => setEditAvatar(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-app-bg text-app-text border border-app-border rounded-xl focus:outline-none focus:border-app-accent transition-colors"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-2.5 bg-app-accent hover:bg-app-accent-hover text-white text-sm font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-app-accent/10 active:scale-98"
        >
          Save Profile Info
        </button>
      </form>

      <hr className="border-app-border my-6" />

      {/* THEME PICKER PANEL */}
      <div className="mb-8">
        <label className="text-xs text-app-muted font-bold uppercase tracking-wider block mb-3">Workspace Theme</label>
        <div className="flex flex-col gap-2">
          <button 
            type="button"
            onClick={() => changeTheme("red-black")}
            className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all text-left cursor-pointer ${
              theme === "red-black" 
                ? "bg-red-950/20 border-red-500/50 text-red-400" 
                : "bg-app-bg border-app-border text-app-text hover:bg-app-hover"
            }`}
          >
            <span className="font-semibold">Crimson Noir</span>
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 border border-red-400" />
          </button>

          <button 
            type="button"
            onClick={() => changeTheme("whatsapp-dark")}
            className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all text-left cursor-pointer ${
              theme === "whatsapp-dark" 
                ? "bg-teal-950/20 border-emerald-500/50 text-emerald-400" 
                : "bg-app-bg border-app-border text-app-text hover:bg-app-hover"
            }`}
          >
            <span className="font-semibold">WhatsApp Dark</span>
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-emerald-400" />
          </button>

          <button 
            type="button"
            onClick={() => changeTheme("whatsapp-light")}
            className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all text-left cursor-pointer ${
              theme === "whatsapp-light" 
                ? "bg-zinc-100 border-emerald-600/50 text-emerald-800" 
                : "bg-app-bg border-app-border text-app-text hover:bg-app-hover"
            }`}
          >
            <span className="font-semibold">WhatsApp Light</span>
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-700 border border-emerald-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

import React from "react";
import { Plus, Smile, ImageIcon, Camera, Mic, Send, X } from "lucide-react";

const mockGalleryImages = [
  { name: "Abstract Fluid Art", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80" },
  { name: "Tech Development Screen", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80" },
  { name: "Minimal Workspace", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80" },
  { name: "Neon Cyberpunk Alley", url: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=600&auto=format&fit=crop&q=80" }
];

const ChatFooter = ({
  messageInput,
  setMessageInput,
  showAttachmentMenu,
  setShowAttachmentMenu,
  showEmojiPicker,
  setShowEmojiPicker,
  selectedAttachment,
  setSelectedAttachment,
  handleSendMessage,
  handleEmojiClick,
  showToast
}) => {
  return (
    <footer className="p-4 bg-app-panel border-t border-app-border flex-shrink-0 z-20 relative">
      {/* ATTACHMENT CHOICE DROPDOWN SELECTOR */}
      {showAttachmentMenu && (
        <div className="absolute bottom-20 left-6 z-30 bg-app-panel border border-app-border p-3 rounded-2xl shadow-2xl flex flex-col gap-2.5 w-44 animate-in slide-in-from-bottom-6 duration-300">
          <div className="text-[10px] text-app-muted uppercase font-bold px-1 pb-1 border-b border-app-border tracking-wider">Send Attachment</div>
          
          {mockGalleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedAttachment({ type: "image", url: img.url, name: img.name });
                setShowAttachmentMenu(false);
              }}
              className="flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-app-text hover:bg-app-hover transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-app-accent" />
              <span className="truncate">{img.name}</span>
            </button>
          ))}
          
          <button 
            type="button"
            onClick={() => {
              setSelectedAttachment({ 
                type: "image", 
                url: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=600&auto=format&fit=crop&q=80", 
                name: "Live Capture Snapshot" 
              });
              setShowAttachmentMenu(false);
            }}
            className="flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-semibold text-app-text hover:bg-app-hover border-t border-app-border/40 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-sky-400" />
            <span>Camera Capture</span>
          </button>
        </div>
      )}

      {/* EMOJI SELECTOR PANEL */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-6 z-30 bg-app-panel border border-app-border p-3.5 rounded-2xl shadow-2xl w-60 animate-in slide-in-from-bottom-6 duration-300">
          <div className="text-[10px] text-app-muted uppercase font-bold tracking-wider mb-2 pb-1 border-b border-app-border">Emojis</div>
          <div className="grid grid-cols-6 gap-2 text-lg">
            {["😀","😂","😍","👍","🔥","🙌","❤️","🎉","☕","💻","⭐","✨","💡","🚀","✔️","❌","👀","🤫"].map(emoji => (
              <button 
                key={emoji}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="hover:scale-125 transition-transform p-1 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File Attachment preview banner */}
      {selectedAttachment && (
        <div className="mb-3.5 p-2 bg-app-bg border border-app-border rounded-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={selectedAttachment.url} alt="preview" className="w-10 h-10 object-cover rounded-lg" />
            <div className="min-w-0">
              <span className="block text-xs font-bold text-app-text truncate">{selectedAttachment.name}</span>
              <span className="block text-[10px] text-app-muted uppercase tracking-wider">Ready to upload</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setSelectedAttachment(null)}
            className="p-1 rounded-full bg-app-hover text-app-muted hover:text-app-text cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        {/* Plus menu action */}
        <button 
          type="button"
          onClick={() => setShowAttachmentMenu(prev => !prev)}
          className={`p-2.5 rounded-xl bg-app-bg text-app-text border hover:border-app-accent hover:text-app-accent transition-all cursor-pointer ${
            showAttachmentMenu ? "border-app-accent text-app-accent bg-app-accent/5" : "border-app-border"
          }`}
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Message Input Box */}
        <input 
          type="text"
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
          }}
          placeholder="Type a message..."
          className="flex-1 py-2.5 px-4 bg-app-bg text-app-text border border-app-border rounded-xl text-sm focus:outline-none focus:border-app-accent transition-colors"
        />

        {/* Emoji Trigger */}
        <button 
          type="button"
          onClick={() => setShowEmojiPicker(prev => !prev)}
          className="p-2 text-app-muted hover:text-app-text transition-colors cursor-pointer"
        >
          <Smile className="w-5.5 h-5.5" />
        </button>

        {/* Send or Mic button */}
        {messageInput.trim() || selectedAttachment ? (
          <button 
            type="submit"
            className="p-2.5 rounded-xl bg-app-accent text-white hover:bg-app-accent-hover transition-colors shadow-lg shadow-app-accent/10 active:scale-95 cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button 
            type="button"
            onClick={() => showToast("Microphone recording simulation started...")}
            className="p-2.5 rounded-xl bg-app-bg text-app-muted border border-app-border hover:text-app-text hover:bg-app-hover transition-all cursor-pointer"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </form>
    </footer>
  );
};

export default ChatFooter;

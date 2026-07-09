import React from "react";
import { Trash2, Check, CheckCheck, PhoneCall } from "lucide-react";

const MessageBubble = ({
  msg,
  isMe,
  isSystem,
  isDeleted,
  hoveredMessageId,
  setHoveredMessageId,
  handleDeleteMessage
}) => {
  if (isSystem) {
    return (
      <div className="flex justify-center my-3 animate-in fade-in duration-300">
        <span className="px-3.5 py-1 rounded-full text-[10px] font-bold bg-zinc-950/60 text-app-muted border border-app-border uppercase tracking-widest flex items-center gap-2">
          {msg.text.includes("Call") && <PhoneCall className="w-3 h-3 text-app-accent" />}
          {msg.text}
        </span>
      </div>
    );
  }

  const messageId = msg._id || msg.id;

  return (
    <div 
      className={`flex ${isMe ? "justify-end" : "justify-start"} group relative`}
      onMouseEnter={() => setHoveredMessageId(messageId)}
      onMouseLeave={() => setHoveredMessageId(null)}
    >
      {/* Hover action menu trigger */}
      {hoveredMessageId === messageId && !isDeleted && isMe && (
        <div className={`absolute top-1 z-30 ${isMe ? "left-0 -translate-x-full pr-2" : "right-0 translate-x-full pl-2"}`}>
          <div className="bg-zinc-950 border border-app-border rounded-xl shadow-2xl p-1 flex gap-1 items-center">
            <button 
              onClick={() => handleDeleteMessage(messageId)}
              className="p-1.5 rounded-lg text-app-muted hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
              title="Delete message"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Message Bubble */}
      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm relative transition-all ${
        isMe 
          ? "bg-app-bubble-sent text-white rounded-tr-none" 
          : "bg-app-bubble-received text-app-text rounded-tl-none border border-app-border"
      }`}>
        
        {/* If Image Msg */}
        {msg.type === "image" && msg.mediaUrl && (
          <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
            <img src={msg.mediaUrl} alt={msg.text} className="w-full max-h-60 object-cover" />
          </div>
        )}

        {/* Text Content */}
        <p className={`leading-relaxed whitespace-pre-wrap ${isDeleted ? "italic text-xs text-app-muted" : ""}`}>
          {msg.text}
        </p>

        {/* Timestamp & Tics Row */}
        <div className="flex items-center justify-end gap-1.5 mt-1 text-[9px] select-none text-right">
          <span className={isMe ? "text-red-200" : "text-app-muted"}>
            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : msg.timestamp}
          </span>
          {isMe && !isDeleted && (
            <span>
              {msg.status === "sent" && <Check className="w-3.5 h-3.5 text-zinc-400" />}
              {msg.status === "delivered" && <CheckCheck className="w-3.5 h-3.5 text-zinc-400" />}
              {msg.status === "read" && <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

import React, { useEffect, useRef } from "react";
import { PhoneCall, MicOff, PhoneOff, VideoOff } from "lucide-react";

const CallOverlay = ({ activeCall, activeCallTimer, endCall }) => {
  const videoRef = useRef(null);

  // Video call stream hook
  useEffect(() => {
    let stream = null;
    if (activeCall && activeCall.type === "video" && activeCall.status === "connected") {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.warn("Camera permission denied or camera not found in CallOverlay:", err);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeCall]);

  if (!activeCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-zinc-950/95 backdrop-blur-2xl text-white font-sans transition-all duration-300">
      {/* Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[10%] left-[20%] w-[50%] h-[50%] rounded-full opacity-20 blur-[150px] ${
          activeCall.type === "video" ? "bg-emerald-500" : "bg-rose-500"
        }`} />
        <div className="absolute bottom-[10%] right-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      {/* Call Info Header */}
      <div className="z-10 text-center mt-12">
        <span className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-zinc-900 border border-zinc-800 mb-6 ${
          activeCall.status === "ringing" ? "text-rose-400 animate-pulse" : "text-emerald-400"
        }`}>
          <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
          {activeCall.status === "ringing" ? "Ringing..." : "Active Call"}
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight mb-2">{activeCall.contact.name}</h2>
        <p className="text-zinc-400 text-sm">
          {activeCall.status === "ringing" ? "Connecting to NexChat Secure Line..." : (
            <span className="font-mono text-lg tracking-widest text-emerald-400">
              {Math.floor(activeCallTimer / 60).toString().padStart(2, "0")}
              :
              {(activeCallTimer % 60).toString().padStart(2, "0")}
            </span>
          )}
        </p>
      </div>

      {/* Middle Visualizer or Video Feed */}
      <div className="z-10 my-6 relative flex items-center justify-center w-full max-w-lg aspect-video md:aspect-square max-h-[360px] rounded-3xl overflow-hidden bg-zinc-900/80 border border-zinc-800 shadow-2xl">
        {activeCall.type === "video" && activeCall.status === "connected" ? (
          <div className="w-full h-full relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform -scale-x-100"
            />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Camera
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <span className="absolute -inset-4 rounded-full bg-rose-500/10 animate-ping opacity-60" />
              <span className="absolute -inset-10 rounded-full bg-rose-500/5 animate-pulse opacity-40" />
              <img 
                src={activeCall.contact.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
                alt="avatar" 
                className="w-32 h-32 rounded-full object-cover border-4 border-rose-500/30 relative z-10"
              />
            </div>
            <div className="flex gap-1.5 items-end h-8">
              {[...Array(9)].map((_, i) => (
                <span 
                  key={i} 
                  className="w-1.5 bg-rose-500/85 rounded-full animate-bounce" 
                  style={{
                    height: `${15 + Math.sin(i * 1.5) * 20}px`,
                    animationDuration: `${0.6 + (i % 3) * 0.2}s`
                  }} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buttons Controls */}
      <div className="z-10 flex gap-6 mb-12">
        <button className="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer">
          <MicOff className="w-6 h-6" />
        </button>
        
        <button 
          onClick={endCall} 
          className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 hover:scale-105 transition-all active:scale-95 cursor-pointer"
        >
          <PhoneOff className="w-7 h-7" />
        </button>

        <button className="p-4 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer">
          <VideoOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CallOverlay;

import React, { useEffect, useState } from "react";
import { LogOut, Sparkles, MessageSquare, ShieldCheck, Cpu } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token") || getCookie("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/auth/getMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    
    // Clear credentials
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm tracking-wider uppercase">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 relative font-sans selection:bg-rose-500">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[20%] w-[60%] h-[60%] rounded-full bg-rose-500/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto z-10 relative">
        {/* Navbar */}
        <header className="flex justify-between items-center bg-zinc-950/80 backdrop-blur-xl px-6 py-4 rounded-2xl border border-zinc-900 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-rose-500/20">
              N
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">NexChat</h1>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Console</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-rose-500/30 hover:bg-rose-950/20 text-zinc-400 hover:text-rose-400 transition-all text-sm font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-2 bg-zinc-950/60 backdrop-blur-xl p-8 rounded-3xl border border-zinc-900 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4" />
                Active Account Session
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight mb-2">
                Welcome back, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-400">
                  {user?.userName || "Guest"}!
                </span>
              </h2>
              <p className="text-zinc-400 text-sm mt-2 max-w-md font-light leading-relaxed">
                You have successfully authenticated using NexChat Secure Auth protocols. Start messaging or manage your security panel.
              </p>
            </div>

            <div className="border-t border-zinc-900/80 pt-6 mt-6 flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-zinc-800" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-rose-500 text-lg">
                    {user?.userName?.substring(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-xs text-zinc-500">Connected Account</div>
                  <div className="text-sm font-semibold">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status Card */}
          <div className="bg-zinc-950/60 backdrop-blur-xl p-6 rounded-3xl border border-zinc-900 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-zinc-900 border border-zinc-800 text-rose-500 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Security Gateway</h3>
                  <p className="text-xs text-zinc-500">SSL Encrypted Session</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-zinc-900 border border-zinc-800 text-cyan-500 rounded-2xl">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Real-time Socket</h3>
                  <p className="text-xs text-zinc-500">Pending Socket.IO client</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-zinc-900 border border-zinc-800 text-emerald-500 rounded-2xl">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">DB Node</h3>
                  <p className="text-xs text-zinc-500">Connected to Mongo + Redis</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("Launching Chat Rooms...")}
              className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-450 active:scale-[0.98] text-white rounded-xl font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-rose-950/20"
            >
              Open Live Chats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

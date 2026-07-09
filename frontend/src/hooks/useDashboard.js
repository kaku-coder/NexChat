import { useState, useEffect, useRef } from "react";
import { chatService } from "../service/chatService";

export const useDashboard = () => {
  // Authentication & Profile States
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  // Views & Overlay states
  const [activeTab, setActiveTab] = useState("chats"); // chats, contacts, settings
  const [activeChatId, setActiveChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  
  // Custom toggles
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  // Calling States
  const [activeCall, setActiveCall] = useState(null);
  const [activeCallTimer, setActiveCallTimer] = useState(0);

  // Core Data Lists
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});

  // Toast Alerts State
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Theme Settings state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("nexchat_theme") || "red-black";
  });

  const callIntervalRef = useRef(null);

  // Helper function to get cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3000);
  };

  // 1️⃣ Fetch Active User Session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem("token") || getCookie("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/auth/getMe", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setUser(data.user);
          setEditName(data.user.userName || "");
          setEditBio(data.user.bio || "Available");
          setEditAvatar(data.user.avatar || "");
        } else {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Error fetching session, falling back to mock user:", err);
        // Offline development fallback
        const mockUser = {
          _id: "me-id-123",
          userName: localStorage.getItem("nexchat_user_name") || "Devil Coder",
          email: "devil@nexchat.io",
          avatar: localStorage.getItem("nexchat_user_avatar") || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
          bio: localStorage.getItem("nexchat_user_bio") || "Let's code awesome stuff! 💻🔥"
        };
        setUser(mockUser);
        setEditName(mockUser.userName);
        setEditBio(mockUser.bio);
        setEditAvatar(mockUser.avatar);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  // 2️⃣ Fetch Contacts list (Users) from MongoDB database
  useEffect(() => {
    if (!user) return;
    const fetchContacts = async () => {
      try {
        const userList = await chatService.getUsers();
        // Transform user list to uniform contacts mapping
        const formatted = userList.map(u => ({
          id: u._id,
          name: u.userName,
          avatar: u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
          status: u.bio || "Offline",
          email: u.email,
          online: false, // will update dynamically via sockets
          bio: u.bio || "Hey there! I am using NexChat."
        }));
        setContacts(formatted);
      } catch (err) {
        console.error("Error fetching contacts from backend, utilizing mock fallback:", err);
        // Fallback contacts for testability
        setContacts([
          { id: "c1", name: "Alice Henderson", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80", status: "Online", email: "alice@nexchat.io", bio: "Designing the future of UI..." },
          { id: "c2", name: "Arthur Morgan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", status: "Focus mode: Active", email: "arthur@nexchat.io", bio: "Outlaw | Redemption explorer" },
          { id: "c3", name: "Beatrice Thorne", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", status: "Available for coffee ☕", email: "beatrice@nexchat.io", bio: "Creative Writer & Strategy" },
          { id: "c4", name: "Cameron Diaz", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80", status: "Running late, as usual", email: "cameron@nexchat.io", bio: "Actor & Philanthropist" },
          { id: "c5", name: "Catherine Webb", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", status: "In a meeting", email: "catherine@nexchat.io", bio: "QA Analyst | Bug hunting" }
        ]);
      }
    };
    fetchContacts();
  }, [user]);

  // 3️⃣ Fetch Messages History from MongoDB database when chat selection changes
  useEffect(() => {
    if (!activeChatId) return;

    const fetchHistory = async () => {
      try {
        const history = await chatService.getMessages(activeChatId);
        setMessages(prev => ({
          ...prev,
          [activeChatId]: history
        }));
      } catch (err) {
        console.error("Error fetching message logs from database:", err);
        // fallback empty or keep local mock history if exists
      }
    };

    fetchHistory();
  }, [activeChatId]);

  // 4️⃣ Synchronize Conversations lists
  useEffect(() => {
    // Generate active conversations sidebar list dynamically based on loaded message history and contact list
    const currentConvs = [];
    Object.keys(messages).forEach(chatId => {
      const contact = contacts.find(c => c.id === chatId);
      const chatMsgs = messages[chatId] || [];
      if (contact && chatMsgs.length > 0) {
        const lastMsg = chatMsgs[chatMsgs.length - 1];
        currentConvs.push({
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar,
          online: contact.online,
          status: contact.status,
          lastMessage: lastMsg.type === "image" ? "📎 Shared an image" : lastMsg.text,
          timestamp: lastMsg.createdAt ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now",
          unreadCount: 0
        });
      }
    });

    // Merge with pre-existing contacts that don't have message histories yet but exist in conversations
    setConversations(currentConvs);
  }, [messages, contacts]);

  // 5️⃣ Call timers handler
  useEffect(() => {
    if (activeCall && activeCall.status === "connected") {
      callIntervalRef.current = setInterval(() => {
        setActiveCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(callIntervalRef.current);
      setActiveCallTimer(0);
    }
    return () => clearInterval(callIntervalRef.current);
  }, [activeCall]);

  // Logout routine
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Logout server error:", err);
    }
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  // Switch Theme helper
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("nexchat_theme", newTheme);
    showToast(`Switched theme to ${newTheme.replace("-", " ").toUpperCase()}`);
  };

  // Save Settings details to MongoDB database
  const saveProfileSettings = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast("Username is required");
      return;
    }

    try {
      const updated = await chatService.updateProfile({
        userName: editName,
        avatar: editAvatar,
        bio: editBio
      });

      setUser(updated);
      showToast("Profile settings saved to MongoDB successfully!");
    } catch (err) {
      console.error("Error saving settings to MongoDB:", err);
      // Fallback
      const fallbackUser = { ...user, userName: editName, avatar: editAvatar, bio: editBio };
      setUser(fallbackUser);
      localStorage.setItem("nexchat_user_name", editName);
      localStorage.setItem("nexchat_user_avatar", editAvatar);
      localStorage.setItem("nexchat_user_bio", editBio);
      showToast("Saved settings locally");
    }
  };

  return {
    user,
    loading,
    editAvatar,
    setEditAvatar,
    editName,
    setEditName,
    editBio,
    setEditBio,
    activeTab,
    setActiveTab,
    activeChatId,
    setActiveChatId,
    searchQuery,
    setSearchQuery,
    messageInput,
    setMessageInput,
    showAttachmentMenu,
    setShowAttachmentMenu,
    showEmojiPicker,
    setShowEmojiPicker,
    selectedAttachment,
    setSelectedAttachment,
    activeCall,
    setActiveCall,
    activeCallTimer,
    setActiveCallTimer,
    contacts,
    setContacts,
    conversations,
    setConversations,
    messages,
    setMessages,
    theme,
    isToastVisible,
    toastMessage,
    showToast,
    changeTheme,
    handleLogout,
    saveProfileSettings
  };
};

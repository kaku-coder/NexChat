const API_URL = "http://localhost:3000/api/chat";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : ""
  };
};

export const chatService = {
  // Get all registered users for contact lists
  async getUsers() {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch users");
      return data.users;
    } catch (error) {
      console.error("chatService getUsers error:", error);
      throw error;
    }
  },

  // Get message history with a specific user
  async getMessages(userId) {
    try {
      const response = await fetch(`${API_URL}/messages/${userId}`, {
        headers: getHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch messages");
      return data.messages;
    } catch (error) {
      console.error("chatService getMessages error:", error);
      throw error;
    }
  },

  // Update user profile info
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");
      return data.user;
    } catch (error) {
      console.error("chatService updateProfile error:", error);
      throw error;
    }
  }
};

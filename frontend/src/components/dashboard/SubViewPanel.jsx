import React from "react";
import { Plus, Search, X } from "lucide-react";
import ConversationsList from "./subviews/ConversationsList";
import ContactsList from "./subviews/ContactsList";
import SettingsPanel from "./subviews/SettingsPanel";

const SubViewPanel = ({
  activeTab,
  setActiveTab,
  activeChatId,
  setActiveChatId,
  searchQuery,
  setSearchQuery,
  filteredConversations,
  typingStates,
  groupedContacts,
  startChatWithContact,
  handleCopyInviteLink,
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
    <aside className={`w-80 flex-shrink-0 flex flex-col bg-app-panel border-r border-app-border z-10 ${
      activeChatId ? "hidden md:flex" : "flex"
    }`}>
      {/* HEADER SECTION */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tight text-app-text">
            {activeTab === "chats" && "Messages"}
            {activeTab === "contacts" && "Contacts"}
            {activeTab === "settings" && "Settings"}
          </h2>
          {activeTab === "chats" && (
            <button 
              onClick={() => setActiveTab("contacts")} 
              className="p-1.5 rounded-lg bg-app-hover text-app-accent hover:bg-app-accent/15 hover:text-app-accent transition-colors cursor-pointer"
              title="New conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search filter (shown in chats and contacts) */}
        {activeTab !== "settings" && (
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder={activeTab === "chats" ? "Search conversations..." : "Search contacts..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-9 pr-4 text-sm bg-app-bg text-app-text placeholder-app-muted border border-app-border rounded-xl focus:outline-none focus:border-app-accent transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 text-app-muted hover:text-app-text">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* RENDER MODULAR SUB-PANELS */}
      {activeTab === "chats" && (
        <ConversationsList
          filteredConversations={filteredConversations}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          typingStates={typingStates}
        />
      )}

      {activeTab === "contacts" && (
        <ContactsList
          groupedContacts={groupedContacts}
          startChatWithContact={startChatWithContact}
          handleCopyInviteLink={handleCopyInviteLink}
        />
      )}

      {activeTab === "settings" && (
        <SettingsPanel
          user={user}
          editAvatar={editAvatar}
          setEditAvatar={setEditAvatar}
          editName={editName}
          setEditName={setEditName}
          editBio={editBio}
          setEditBio={setEditBio}
          saveProfileSettings={saveProfileSettings}
          changeTheme={changeTheme}
          theme={theme}
        />
      )}
    </aside>
  );
};

export default SubViewPanel;

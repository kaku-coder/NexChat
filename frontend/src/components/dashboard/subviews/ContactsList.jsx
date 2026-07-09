import React from "react";

const ContactsList = ({
  groupedContacts,
  startChatWithContact,
  handleCopyInviteLink
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 flex flex-col justify-between">
      <div>
        {Object.keys(groupedContacts).length > 0 ? (
          Object.keys(groupedContacts).sort().map(letter => (
            <div key={letter} className="mb-4">
              <div className="text-app-accent text-xs font-bold px-2 mb-2 tracking-wider">{letter}</div>
              <div className="flex flex-col gap-1">
                {groupedContacts[letter].map(contact => (
                  <div 
                    key={contact.id}
                    onClick={() => startChatWithContact(contact)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-app-hover cursor-pointer transition-colors"
                  >
                    <img 
                      src={contact.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
                      alt={contact.name} 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-app-text truncate">{contact.name}</h4>
                      <p className="text-xs text-app-muted truncate">{contact.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-app-muted text-sm">No contacts matching search</p>
          </div>
        )}
      </div>

      {/* Invite Friends Action Box */}
      <div className="bg-app-bg border border-app-border p-4 rounded-2xl my-4 flex flex-col gap-3">
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-app-text">Invite Friends</h4>
          <p className="text-[11px] text-app-muted mt-1 leading-relaxed">Expand your secured chat network and share invite room link.</p>
        </div>
        <button 
          onClick={handleCopyInviteLink}
          className="w-full py-2 bg-app-accent hover:bg-app-accent-hover text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          Share Invite Link
        </button>
      </div>
    </div>
  );
};

export default ContactsList;

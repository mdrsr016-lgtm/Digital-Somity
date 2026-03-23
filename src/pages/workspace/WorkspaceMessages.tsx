import { MessageCircle } from "lucide-react";

export const WorkspaceMessages = () => {
  return (
    <div className="ws-page-width">
      <div className="ws-header">
        <h1>Messages</h1>
        <p>Your conversations will appear here.</p>
      </div>

      <div className="ws-messages-empty">
        <div className="ws-messages-empty-icon">
          <MessageCircle size={40} strokeWidth={1.5} />
        </div>
        <h3>No messages yet</h3>
        <p>When you receive a message, it will show up here.</p>
      </div>
    </div>
  );
};

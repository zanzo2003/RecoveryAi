import './ChatSidebar.css';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });

const ChatSidebar = ({ sessions, activeSessionId, onSelect, onNewChat }) => {
  return (
    <div className="chat-sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>+ New Chat</button>
      <div className="sidebar-sessions">
        {sessions.map((s) => (
          <button
            key={s.id}
            className={`sidebar-session-item ${s.id === activeSessionId ? 'active' : ''}`}
            onClick={() => onSelect(s.id)}
          >
            Talked on {formatDate(s.createdAt)}
          </button>
        ))}
        {sessions.length === 0 && (
          <p className="sidebar-empty">No previous conversations</p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

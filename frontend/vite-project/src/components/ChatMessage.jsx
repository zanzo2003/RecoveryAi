import RiskBadge from './RiskBadge';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-bubble">
        <p className="message-text">{message.content}</p>
        {!isUser && message.riskLevel && (
          <div className="message-meta">
            <RiskBadge level={message.riskLevel} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

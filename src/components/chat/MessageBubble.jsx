const MessageBubble = ({ message, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
        isOwn ? 'rounded-br-sm bg-brand-600 text-white' : 'rounded-bl-sm bg-gray-100 text-gray-800'
      }`}
    >
      <p>{message.text}</p>
      <span className={`mt-1 block text-[10px] ${isOwn ? 'text-brand-100' : 'text-gray-400'}`}>
        {new Date(message.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  </div>
);

export default MessageBubble;

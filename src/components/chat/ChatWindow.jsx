import { useEffect, useRef, useState } from 'react';
import { Avatar, IconButton, Input } from '@material-tailwind/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../../store/authStore.js';
import { useChatStore } from '../../store/chatStore.js';
import MessageBubble from './MessageBubble.jsx';
import Loader from '../common/Loader.jsx';

const ChatWindow = ({ partner }) => {
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { messages, fetchConversation, sendMessage, setActiveConversation } = useChatStore();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!partner?._id) return;
    setActiveConversation(partner._id);
    setIsLoading(true);
    fetchConversation(partner._id).finally(() => setIsLoading(false));
  }, [partner?._id, fetchConversation, setActiveConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setText('');
    await sendMessage(partner._id, trimmed);
  };

  if (!partner) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Suhbatni boshlash uchun chapdan foydalanuvchini tanlang
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <Avatar
          size="sm"
          src={partner.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${partner.fullName}`}
          alt={partner.fullName}
        />
        <p className="text-sm font-semibold">{partner.fullName}</p>
      </div>

      <div className="thin-scrollbar flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <Loader label="Suhbat yuklanmoqda..." />
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m._id}
              message={m}
              isOwn={(m.sender?._id || m.sender) === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 p-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Xabar yozing..."
          containerProps={{ className: 'flex-1' }}
        />
        <IconButton type="submit" className="bg-brand-600">
          <PaperAirplaneIcon className="h-4 w-4" />
        </IconButton>
      </form>
    </div>
  );
};

export default ChatWindow;

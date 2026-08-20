import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography } from '@material-tailwind/react';
import api from '../lib/axios.js';
import { useChatStore } from '../store/chatStore.js';
import ConversationList from '../components/chat/ConversationList.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import Loader from '../components/common/Loader.jsx';

const MessagesPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { conversations, fetchConversations } = useChatStore();

  const [partner, setPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    await fetchConversations();
    setIsLoading(false);
  }, [fetchConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Route'da userId bo'lsa (masalan /messages/:userId) - shu odamning
  // ma'lumotini yuklab, chatni ochamiz. Suhbatlar ro'yxatida hali yo'q
  // bo'lsa ham (birinchi marta yozayotgan bo'lsa) profilini alohida olamiz.
  useEffect(() => {
    if (!userId) {
      setPartner(null);
      return;
    }

    const existing = conversations.find((c) => c.user._id === userId);
    if (existing) {
      setPartner(existing.user);
      return;
    }

    api.get(`/users/${userId}`).then(({ data }) => setPartner(data));
  }, [userId, conversations]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <Typography variant="h4">Xabarlar</Typography>

      <div className="flex flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="thin-scrollbar w-72 shrink-0 overflow-y-auto border-r border-gray-100">
          {isLoading ? (
            <Loader label="Suhbatlar yuklanmoqda..." />
          ) : (
            <ConversationList
              conversations={conversations}
              activeUserId={userId}
              onSelect={(id) => navigate(`/messages/${id}`)}
            />
          )}
        </div>

        <div className="flex-1">
          <ChatWindow partner={partner} />
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

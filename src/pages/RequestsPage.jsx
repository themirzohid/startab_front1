import { useEffect, useState, useCallback } from 'react';
import { Typography, Tabs, TabsHeader, Tab } from '@material-tailwind/react';
import api from '../lib/axios.js';
import RequestCard from '../components/requests/RequestCard.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const TABS = [
  { value: '', label: 'Barchasi' },
  { value: 'pending', label: 'Kutilayotgan' },
  { value: 'accepted', label: 'Qabul qilingan' },
  { value: 'rejected', label: 'Rad etilgan' },
];

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = activeTab ? { status: activeTab } : {};
      const { data } = await api.get('/requests/me', { params });
      setRequests(data);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleRespond = async (requestId, status) => {
    await api.put(`/requests/${requestId}/respond`, { status });
    setRequests((prev) => prev.map((r) => (r._id === requestId ? { ...r, status } : r)));
  };

  return (

    <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl border border-lime-200/80 bg-gradient-to-b from-sky-50/40 via-white to-white p-6 shadow-2xl shadow-sky-900/10">


      <div className="border-b border-stone-200/80 pb-4">
        <Typography variant="h4" className="text-sky-950 font-extrabold tracking-tight">
          So'rov va takliflar
        </Typography>
        <Typography variant="small" className="mt-1 text-stone-600 font-medium">
          Sizga kelgan qo'shilish so'rovlari va startap takliflarini shu yerda boshqarasiz
        </Typography>
      </div>


      <div className="rounded-2xl bg-sky-100/50 p-1.5 shadow-inner">
        <Tabs value={activeTab}>
          <TabsHeader
            className="bg-transparent"
            indicatorProps={{
              className: "bg-white shadow-md shadow-sky-900/10 rounded-xl",
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`py-2.5 font-bold text-sm transition-colors duration-200 ${activeTab === tab.value ? 'text-pink-600' : 'text-stone-600 hover:text-sky-900'
                  }`}
              >
                {tab.label}
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
      </div>


      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-white/80 p-10 text-center shadow-md">
          <EmptyState title="Bu bo'limda hech narsa yo'q" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <div
              key={req._id}

              className="rounded-2xl border border-lime-300/70 bg-white p-2 shadow-md shadow-sky-900/5 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-0.5 transition-all duration-200"
            >
              <RequestCard request={req} onRespond={handleRespond} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;

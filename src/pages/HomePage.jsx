import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import api from '../lib/axios.js';
import { useAuthStore } from '../store/authStore.js';
import StartupFilter from '../components/startup/StartupFilter.jsx';
import StartupCard from '../components/startup/StartupCard.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const HomePage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const [filters, setFilters] = useState({});
  const [startups, setStartups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStartups = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await api.get('/startups', { params });
      setStartups(data.startups);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadStartups();
  }, [loadStartups]);

  return (
    < div className = "mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl border border-lime-200/60 bg-gradient-to-b from-sky-50/50 via-white to-sky-50/20 p-6 shadow-xl shadow-sky-900/5" >

      < div className = "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200/80 pb-5" >
        <div>
          <Typography variant="h4" className="text-sky-950 font-extrabold tracking-tight">
            Jamoa qidirayotgan startaplar
          </Typography>
          <Typography variant="small" className="text-stone-600 font-medium mt-1">
            G'oyangizni e'lon qiling yoki o'zingizga mos loyihani toping
          </Typography>
        </div>

  {
    isAuthenticated && (
      <Link to="/startups/new">
        <Button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
          <PlusIcon className="h-5 w-5 stroke-[2.5]" />
          <span>Startap yaratish</span>
        </Button>
      </Link>
    )
  }
  </div >

  < div className = "rounded-2xl border border-lime-300 bg-white p-5 shadow-md shadow-lime-900/5 hover:shadow-lg transition-all duration-200" >
    <StartupFilter filters={filters} onChange={setFilters} />
  </div >

{
  isLoading ? (
    <div className="flex justify-center py-16">
      <Loader />
    </div>
  ) : startups.length === 0 ? (
    <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-white/80 p-10 text-center shadow-md">
      <EmptyState
        title="Hozircha mos startap topilmadi"
        description="Filtrni o'zgartirib ko'ring yoki birinchi bo'lib g'oyangizni joylashtiring."
      />
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {startups.map((s) => (
        <div
          key={s._id}
          className="group rounded-2xl border border-sky-100 bg-white p-1 shadow-lg shadow-sky-900/5 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
        >
          <StartupCard startup={s} />
        </div>
      ))}
    </div>
  )
}
</div >
  );
};

export default HomePage;

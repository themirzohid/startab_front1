import { useEffect, useState, useCallback } from 'react';
import { Typography } from '@material-tailwind/react';
import api from '../lib/axios.js';
import DeveloperFilter from '../components/developer/DeveloperFilter.jsx';
import DeveloperCard from '../components/developer/DeveloperCard.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const DevelopersPage = () => {
  const [filters, setFilters] = useState({});
  const [developers, setDevelopers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDevelopers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries({ ...filters, tech: filters.search }).filter(([, v]) => v)
      );
      const { data } = await api.get('/users', { params });
      setDevelopers(data.users);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDevelopers();
  }, [loadDevelopers]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl border border-lime-200/80 bg-gradient-to-b from-sky-50/40 via-white to-white p-6 shadow-2xl shadow-sky-900/10">
  {/* Sarlavha Qismi */}
  <div className="border-b border-stone-200/80 pb-4">
    <Typography variant="h4" className="font-extrabold tracking-tight text-sky-950">
      Dasturchilar
    </Typography>
    <Typography variant="small" className="mt-1 font-medium text-stone-600">
      Kategoriya va daraja bo'yicha filtrlab, jamoangizga mos mutaxassisni toping
    </Typography>
  </div>

  {/* Filtr Komponenti */}
  <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-md shadow-sky-900/5">
    <DeveloperFilter filters={filters} onChange={setFilters} />
  </div>

  {/* Kontent va Kartochkalar Ro'yxati */}
  {isLoading ? (
    <div className="flex justify-center py-12">
      <Loader />
    </div>
  ) : developers.length === 0 ? (
    <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-white/80 p-10 text-center shadow-md">
      <EmptyState title="Mos dasturchi topilmadi" description="Filtrni o'zgartirib ko'ring." />
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {developers.map((dev) => (
        <div
          key={dev._id}
          className="rounded-2xl border border-lime-300/70 bg-white p-1 shadow-md shadow-sky-900/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-500/10"
        >
          <DeveloperCard developer={dev} />
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default DevelopersPage;

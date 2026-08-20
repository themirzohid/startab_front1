import { useState } from 'react';
import { Chip, Spinner } from '@material-tailwind/react';
import api from '../../lib/axios.js';
import { categoryLabel } from '../../constants/categories.js';
import DeveloperCard from '../developer/DeveloperCard.jsx';
import EmptyState from '../common/EmptyState.jsx';

/**
 * Startap yaratuvchisi "kerakli mutaxassislar" bo'limiga ma'lumot kiritgan bo'lsa,
 * shu yerda mos keladigan dasturchilar ko'rsatiladi. Bu — IXTIYORIY qulaylik:
 * hech qanday roleni tanlamaslik ham mumkin, tanlash MAJBURIY emas.
 */
const MatchingDevelopers = ({ requiredRoles = [] }) => {
  const [activeRole, setActiveRole] = useState(null); // hech narsa tanlanmagan holat - default
  const [developers, setDevelopers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!requiredRoles.length) return null; // startap egasi umuman kiritmagan bo'lsa - bo'lim ko'rinmaydi

  const handleSelectRole = async (role) => {
    // qayta bosilsa - filtrni bekor qilish (tanlamaslik ham mumkin)
    if (activeRole === role) {
      setActiveRole(null);
      setDevelopers([]);
      return;
    }

    setActiveRole(role);
    setIsLoading(true);
    try {
      const { data } = await api.get('/users', {
        params: { category: role.category, level: role.level, limit: 8 },
      });
      setDevelopers(data.users);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="mb-1 text-sm font-semibold">Mos keladigan dasturchilarni ko'rish</p>
      <p className="mb-3 text-xs text-gray-500">
        Kerakli mutaxassislikni bosing — mos profillar chiqadi. Tanlash shart emas.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {requiredRoles.map((role, i) => (
          <Chip
            key={i}
            value={`${categoryLabel(role.category)} · ${role.level}`}
            variant={activeRole === role ? 'filled' : 'outlined'}
            color={activeRole === role ? 'blue' : 'blue-gray'}
            className="cursor-pointer select-none rounded-full"
            onClick={() => handleSelectRole(role)}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-6">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      {!isLoading && activeRole && developers.length === 0 && (
        <EmptyState title="Hozircha mos dasturchi topilmadi" />
      )}

      {!isLoading && developers.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {developers.map((dev) => (
            <DeveloperCard key={dev._id} developer={dev} compact />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchingDevelopers;

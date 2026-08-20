import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Alert,
} from '@material-tailwind/react';
import api from '../lib/axios.js';
import { useAuthStore } from '../store/authStore.js';
import { categoryLabel } from '../constants/categories.js';
import MatchingDevelopers from '../components/startup/MatchingDevelopers.jsx';
import Loader from '../components/common/Loader.jsx';

const StartupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const [startup, setStartup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadStartup = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/startups/${id}`);
      setStartup(data);
    } catch (err) {
      setFeedback({
        type: 'red',
        text: err.response?.data?.message || 'Startap ma\'lumotlarini yuklashda xatolik yuz berdi',
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStartup();
  }, [loadStartup]);

  if (isLoading) return <Loader />;
  if (!startup) {
    return (
      <div className="p-6 text-center">
        {feedback && <Alert color={feedback.type}>{feedback.text}</Alert>}
        <Typography variant="h5" className="mt-4 text-stone-600">
          Startap topilmadi
        </Typography>
      </div>
    );
  }

  const isOwner = currentUser?._id === startup.owner?._id;
  const alreadyMember = startup.teamMembers?.some((m) => m.user?._id === currentUser?._id);

  const handleJoinRequest = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/requests/join', { startupId: startup._id, message: joinMessage });
      setFeedback({ type: 'green', text: "So'rovingiz muvaffaqiyatli yuborildi!" });
      setIsJoinOpen(false);
      setJoinMessage('');
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Rostdan ham bu startapni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/startups/${startup._id}`);
      navigate('/');
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || "O'chirishda xatolik" });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
      {feedback && <Alert color={feedback.type}>{feedback.text}</Alert>}

      {/* Asosiy ma'lumotlar bloki */}
      <div className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Typography variant="h3" className="text-sky-950 font-bold">
              {startup.title}
            </Typography>
            <div className="mt-2 flex items-center gap-2 text-sm text-stone-600">
              <Avatar
                size="xs"
                className="border border-pink-400"
                src={
                  startup.owner?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${startup.owner?.fullName || 'Owner'}`
                }
              />
              <Link to={`/developers/${startup.owner?._id}`} className="hover:underline text-sky-800 font-medium">
                {startup.owner?.fullName}
              </Link>
              <span>·</span>
              <span className="rounded-md bg-lime-100 px-2 py-0.5 text-xs font-semibold text-lime-900 border border-lime-200">
                {startup.industry || 'Soha ko\'rsatilmagan'}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            {isOwner ? (
              <>
                <Link to={`/startups/${startup._id}/edit`}>
                  <Button size="sm" variant="outlined" className="border-sky-600 text-sky-700 hover:bg-sky-50">
                    Tahrirlash
                  </Button>
                </Link>
                <Button size="sm" color="red" variant="outlined" onClick={handleDelete}>
                  O'chirish
                </Button>
              </>
            ) : (
              isAuthenticated &&
              !alreadyMember && (
                <Button
                  className="bg-sky-600 hover:bg-sky-700 text-white shadow-md hover:shadow-sky-600/30 transition-all"
                  onClick={() => setIsJoinOpen(true)}
                >
                  Jamoaga qo'shilish
                </Button>
              )
            )}
          </div>
        </div>

        <Typography className="whitespace-pre-line text-stone-700 leading-relaxed">
          {startup.description}
        </Typography>

        {startup.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {startup.tags.map((tag, i) => (
              <Chip
                key={i}
                size="sm"
                value={`#${tag}`}
                className="rounded-full bg-pink-50 text-pink-700 border border-pink-200 normal-case"
              />
            ))}
          </div>
        )}
      </div>

      {/* Kerakli mutaxassislar */}
      {startup.requiredRoles?.length > 0 && (
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <Typography variant="h6" className="mb-3 text-sky-900 font-semibold">
            Kerakli mutaxassislar
          </Typography>
          <div className="flex flex-wrap gap-2">
            {startup.requiredRoles.map((r, i) => (
              <Chip
                key={i}
                value={`${categoryLabel(r.category)} · ${r.level} · ${r.slots} ta slot`}
                className="rounded-full bg-lime-100 text-lime-900 border border-lime-300 normal-case"
              />
            ))}
          </div>
        </div>
      )}

      {/* Mos keladigan dasturchilar (faqat muallifga ko'rinadi) */}
      {isOwner && <MatchingDevelopers requiredRoles={startup.requiredRoles} />}

      {/* Jamoa a'zolari */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <Typography variant="h6" className="mb-3 text-sky-900 font-semibold">
          Jamoa a'zolari ({startup.teamMembers?.length || 0})
        </Typography>
        <div className="flex flex-wrap gap-3">
          {startup.teamMembers?.map((m) => (
            <Link
              key={m.user?._id}
              to={`/developers/${m.user?._id}`}
              className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 py-1 pl-1 pr-3 hover:bg-sky-50 hover:border-sky-300 transition-colors"
            >
              <Avatar
                size="xs"
                src={
                  m.user?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${m.user?.fullName || 'User'}`
                }
              />
              <span className="text-sm font-medium text-stone-800">{m.user?.fullName}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Qo'shilish so'rovi modal oynasi */}
      <Dialog open={isJoinOpen} handler={() => setIsJoinOpen(false)}>
        <DialogHeader className="text-sky-950 font-bold">Jamoaga qo'shilish so'rovi</DialogHeader>
        <DialogBody className="flex flex-col gap-3">
          <Typography variant="small" className="text-stone-600">
            O'zingiz haqingizda yozish shart emas — xohlasangiz qisqacha xabar qoldiring, xohlamasangiz
            shunchaki so'rov yuboraverishingiz mumkin.
          </Typography>
          <Textarea
            label="Xabar (ixtiyoriy)"
            color="sky"
            value={joinMessage}
            onChange={(e) => setJoinMessage(e.target.value)}
          />
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="text" color="stone" onClick={() => setIsJoinOpen(false)}>
            Bekor qilish
          </Button>
          <Button
            className="bg-pink-500 hover:bg-pink-600 text-white"
            loading={isSubmitting}
            onClick={handleJoinRequest}
          >
            So'rov yuborish
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default StartupDetailPage;
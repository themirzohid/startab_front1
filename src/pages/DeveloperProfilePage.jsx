import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Avatar,
  Button,
  Chip,
  Card,
  CardBody,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Alert,
} from '@material-tailwind/react';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import api from '../lib/axios.js';
import { useAuthStore } from '../store/authStore.js';
import CategoryBadge from '../components/common/CategoryBadge.jsx';
import Loader from '../components/common/Loader.jsx';

const DeveloperProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const [developer, setDeveloper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [myStartups, setMyStartups] = useState([]);
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDeveloper = useCallback(async () => {
    setIsLoading(true);
    const { data } = await api.get(`/users/${id}`);
    setDeveloper(data);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    loadDeveloper();
  }, [loadDeveloper]);

  const openInviteDialog = async () => {
    setIsInviteOpen(true);
    const { data } = await api.get('/startups', { params: { owner: currentUser._id, limit: 50 } });
    setMyStartups(data.startups);
  };

  const handleInvite = async () => {
    if (!selectedStartupId) return;
    setIsSubmitting(true);
    try {
      await api.post('/requests/invite', {
        startupId: selectedStartupId,
        developerId: developer._id,
        role: developer.category,
      });
      setFeedback({ type: 'green', text: 'Taklifnoma yuborildi!' });
      setIsInviteOpen(false);
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!developer) return null;

  const isOwnProfile = currentUser?._id === developer._id;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl border border-lime-200/80 bg-gradient-to-b from-sky-50/40 via-white to-white p-6 shadow-2xl shadow-sky-900/10">
  {/* Feedback Xabarnomasi */}
  {feedback && (
    <Alert
      color={feedback.type}
      className={`rounded-2xl border text-xs shadow-sm ${
        feedback.type === 'red'
          ? 'border-pink-200 bg-pink-50 text-pink-700'
          : 'border-lime-200 bg-lime-50 text-lime-800'
      }`}
    >
      {feedback.text}
    </Alert>
  )}

  {/* Asosiy Profil Kartochkasi */}
  <Card className="rounded-2xl border border-sky-100 bg-white shadow-md shadow-sky-900/5 transition-all duration-200 hover:shadow-lg">
    <CardBody className="flex flex-col items-center gap-3 text-center p-6">
      <Avatar
        size="xxl"
        src={developer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${developer.fullName}`}
        alt={developer.fullName}
        className="border-2 border-pink-400 p-0.5 shadow-md shadow-pink-500/20"
      />
      <Typography variant="h4" className="font-extrabold tracking-tight text-sky-950">
        {developer.fullName}
      </Typography>
      <CategoryBadge category={developer.category} level={developer.level} />
      
      {developer.bio && (
        <Typography className="max-w-md text-stone-600 font-medium text-sm leading-relaxed">
          {developer.bio}
        </Typography>
      )}

      {!isOwnProfile && isAuthenticated && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Button
            className="flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-extrabold text-white shadow-md shadow-pink-500/30 transition-all hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/40 active:translate-y-0"
            onClick={() => navigate(`/messages/${developer._id}`)}
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 stroke-[2.5]" /> Chatga o'tish
          </Button>
          
          {developer.category !== 'Regular User' && (
            <Button
              variant="outlined"
              className="flex items-center gap-2 rounded-xl border-sky-600 px-5 py-3 font-bold text-sky-700 hover:bg-sky-50 transition-all"
              onClick={openInviteDialog}
            >
              <PaperAirplaneIcon className="h-4 w-4 stroke-[2.5]" /> Taklif yuborish
            </Button>
          )}
        </div>
      )}
    </CardBody>
  </Card>

  {/* Texnologik Stek Kartochkasi */}
  {developer.techStack?.length > 0 && (
    <Card className="rounded-2xl border border-lime-300/80 bg-white shadow-md shadow-lime-900/5 transition-all duration-200 hover:shadow-lg">
      <CardBody className="p-5 sm:p-6">
        <Typography variant="h6" className="mb-3 font-bold text-sky-950">
          Texnologik stek
        </Typography>
        <div className="flex flex-wrap gap-2">
          {developer.techStack.map((tech, i) => (
            <Chip
              key={i}
              value={tech}
              variant="ghost"
              className="rounded-full border border-lime-300 bg-lime-100/80 px-3.5 py-1 text-xs font-bold text-lime-900 shadow-sm lowercase"
            />
          ))}
        </div>
      </CardBody>
    </Card>
  )}

  {/* Sertifikatlar Kartochkasi */}
  {developer.certificates?.length > 0 && (
    <Card className="rounded-2xl border border-sky-100 bg-white shadow-md shadow-sky-900/5 transition-all duration-200 hover:shadow-lg">
      <CardBody className="p-5 sm:p-6">
        <Typography variant="h6" className="mb-3 font-bold text-sky-950">
          Sertifikatlar
        </Typography>
        <div className="flex flex-col gap-3">
          {developer.certificates.map((cert, i) => (
            <div key={i} className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50/30">
              <p className="text-sm font-bold text-sky-950">{cert.title}</p>
              <p className="mt-0.5 text-xs font-medium text-stone-500">
                {cert.issuer}
                {cert.issueDate && ` · ${new Date(cert.issueDate).getFullYear()}`}
              </p>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline"
                >
                  Sertifikatni ko'rish →
                </a>
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )}

  {/* Taklif Modal (Dialog) */}
  <Dialog open={isInviteOpen} handler={() => setIsInviteOpen(false)} className="rounded-3xl border border-sky-100 p-2 shadow-2xl">
    <DialogHeader className="font-extrabold text-sky-950">{developer.fullName}ga taklif yuborish</DialogHeader>
    <DialogBody>
      {myStartups.length === 0 ? (
        <Typography className="text-sm font-medium text-stone-600">
          Sizda hali startap yo'q.{' '}
          <a href="/startups/new" className="font-bold text-pink-600 hover:underline">
            Avval startap yarating
          </a>
          .
        </Typography>
      ) : (
        <Select label="Qaysi startapga taklif qilasiz?" color="sky" onChange={(v) => setSelectedStartupId(v)}>
          {myStartups.map((s) => (
            <Option key={s._id} value={s._id}>
              {s.title}
            </Option>
          ))}
        </Select>
      )}
    </DialogBody>
    <DialogFooter className="gap-2">
      <Button variant="text" color="stone" className="rounded-xl font-bold" onClick={() => setIsInviteOpen(false)}>
        Bekor qilish
      </Button>
      <Button
        className="rounded-xl bg-pink-500 px-5 font-bold text-white shadow-md shadow-pink-500/30 hover:bg-pink-600"
        disabled={!selectedStartupId}
        loading={isSubmitting}
        onClick={handleInvite}
      >
        Taklif yuborish
      </Button>
    </DialogFooter>
  </Dialog>
</div>
  );
};

export default DeveloperProfilePage;

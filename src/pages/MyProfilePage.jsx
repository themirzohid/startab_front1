import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Typography,
  Card,
  CardBody,
  Input,
  Textarea,
  Select,
  Option,
  Button,
  IconButton,
  Alert,
  Avatar,
} from '@material-tailwind/react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import api from '../lib/axios.js';
import { useAuthStore } from '../store/authStore.js';
import { CATEGORIES, LEVELS } from '../constants/categories.js';

const MyProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techInput, setTechInput] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      category: user?.category || '',
      level: user?.level || '',
      avatar: user?.avatar || '',
      techStack: user?.techStack || [],
      certificates: user?.certificates || [],
    },
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: 'certificates',
  });

  const techStack = watch('techStack');
  const category = watch('category');
  const isRegularUser = category === 'Regular User';

  useEffect(() => {
    // Sahifa ochilganda serverdagi eng so'nggi profil ma'lumotini olamiz
    (async () => {
      const { data } = await api.get('/auth/me');
      reset({
        fullName: data.fullName,
        bio: data.bio,
        category: data.category,
        level: data.level,
        avatar: data.avatar,
        techStack: data.techStack || [],
        certificates: data.certificates || [],
      });
    })();
  }, [reset]);

  const addTech = () => {
    const value = techInput.trim();
    if (!value) return;
    setValue('techStack', [...techStack, value]);
    setTechInput('');
  };

  const removeTech = (index) => {
    setValue('techStack', techStack.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const payload = { ...data };
      if (isRegularUser) payload.level = 'N/A';

      const { data: updated } = await api.put('/users/profile/me', payload);
      updateUser(updated);
      setFeedback({ type: 'green', text: 'Profil yangilandi!' });
    } catch (err) {
      setFeedback({ type: 'red', text: err.response?.data?.message || 'Xatolik yuz berdi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl border border-lime-200/80 bg-gradient-to-b from-sky-50/40 via-white to-white p-6 shadow-2xl shadow-sky-900/10">
  {/* Sarlavha va Avatar */}
  <div className="flex items-center gap-4 border-b border-stone-200/80 pb-5">
    <Avatar
      size="xl"
      className="border-2 border-pink-400 p-0.5 shadow-md shadow-pink-500/20"
      src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`}
    />
    <div>
      <Typography variant="h4" className="font-extrabold tracking-tight text-sky-950">
        Mening profilim
      </Typography>
      <Typography variant="small" className="mt-1 font-medium text-stone-600">
        Boshqalar sizni shu ma'lumotlar orqali topadi
      </Typography>
    </div>
  </div>

  {/* Xabarnoma */}
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

  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
    {/* Asosiy Kartochka */}
    <Card className="rounded-2xl border border-sky-100 bg-white shadow-md shadow-sky-900/5 transition-all duration-200 hover:shadow-lg">
      <CardBody className="flex flex-col gap-4 p-5 sm:p-6">
        <Typography variant="h6" className="font-bold text-sky-950">
          Shaxsiy ma'lumotlar
        </Typography>

        <Input label="To'liq ism" color="sky" {...register('fullName')} />
        <Textarea label="O'zingiz haqingizda (ixtiyoriy)" color="sky" rows={3} {...register('bio')} />
        <Input label="Avatar rasm havolasi (ixtiyoriy)" color="sky" {...register('avatar')} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Kategoriya" color="sky" value={category} onChange={(v) => setValue('category', v)}>
            {CATEGORIES.map((c) => (
              <Option key={c.value} value={c.value}>
                {c.label}
              </Option>
            ))}
          </Select>

          {!isRegularUser && (
            <Select label="Daraja" color="sky" value={watch('level')} onChange={(v) => setValue('level', v)}>
              {LEVELS.map((l) => (
                <Option key={l.value} value={l.value}>
                  {l.label}
                </Option>
              ))}
            </Select>
          )}
        </div>
      </CardBody>
    </Card>

    {/* Texnologik Stek Kartochkasi */}
    {!isRegularUser && (
      <Card className="rounded-2xl border border-lime-300/80 bg-white shadow-md shadow-lime-900/5 transition-all duration-200 hover:shadow-lg">
        <CardBody className="flex flex-col gap-4 p-5 sm:p-6">
          <Typography variant="h6" className="font-bold text-sky-950">
            Texnologik stek
          </Typography>

          <div className="flex gap-2">
            <Input
              label="Masalan: React, Node.js"
              color="sky"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
            />
            <Button
              type="button"
              className="shrink-0 rounded-xl bg-sky-600 px-5 font-semibold text-white shadow-md shadow-sky-600/20 transition-all hover:bg-sky-700 hover:shadow-sky-600/30"
              onClick={addTech}
            >
              Qo'shish
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {techStack?.map((tech, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 rounded-full border border-lime-300 bg-lime-100/80 px-3 py-1 text-xs font-bold text-lime-900 shadow-sm"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(i)}
                  className="ml-1 text-sm font-extrabold leading-none text-lime-800 transition-colors hover:text-pink-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </CardBody>
      </Card>
    )}

    {/* Sertifikatlar Kartochkasi */}
    {!isRegularUser && (
      <Card className="rounded-2xl border border-sky-100 bg-white shadow-md shadow-sky-900/5 transition-all duration-200 hover:shadow-lg">
        <CardBody className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="font-bold text-sky-950">
              Sertifikatlar
            </Typography>
            <Button
              type="button"
              size="sm"
              variant="outlined"
              className="flex items-center gap-1.5 rounded-xl border-pink-400 font-bold text-pink-600 hover:bg-pink-50"
              onClick={() => appendCert({ title: '', issuer: '', issueDate: '', credentialUrl: '' })}
            >
              <PlusIcon className="h-4 w-4 stroke-[3]" /> Qo'shish
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {certFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200 bg-stone-50/60 p-4 shadow-sm sm:grid-cols-[2fr_1fr_1fr_auto]"
              >
                <Input label="Nomi" color="sky" {...register(`certificates.${index}.title`)} />
                <Input label="Bergan tashkilot" color="sky" {...register(`certificates.${index}.issuer`)} />
                <Input type="date" label="Sana" color="sky" {...register(`certificates.${index}.issueDate`)} />

                <IconButton
                  variant="text"
                  color="red"
                  className="rounded-xl text-pink-600 hover:bg-pink-50"
                  onClick={() => removeCert(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>

                <Input
                  label="Sertifikat havolasi"
                  color="sky"
                  className="sm:col-span-4"
                  {...register(`certificates.${index}.credentialUrl`)}
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    )}

    {/* Saqlash Tugmasi */}
    <Button
      type="submit"
      size="lg"
      className="rounded-xl bg-pink-500 py-3.5 font-extrabold text-white shadow-lg shadow-pink-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-xl hover:shadow-pink-500/40 active:translate-y-0"
      loading={isSubmitting}
    >
      Saqlash
    </Button>
  </form>
</div>
  );
};

export default MyProfilePage;

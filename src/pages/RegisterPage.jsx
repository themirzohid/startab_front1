import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Select, Option, Button, Typography, Alert } from '@material-tailwind/react';
import { useAuthStore } from '../store/authStore.js';
import { CATEGORIES, LEVELS } from '../constants/categories.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { category: '', level: '' } });

  const selectedCategory = watch('category');
  const isRegularUser = selectedCategory === 'Regular User';

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (isRegularUser) delete payload.level; // "Oddiy foydalanuvchi" uchun daraja shart emas

    const result = await registerUser(payload);
    if (result.success) navigate('/');
  };

  return (
<div className="mx-auto flex max-w-md flex-col items-center py-10 px-4">
  <Card className="w-full rounded-3xl border border-lime-200/80 bg-gradient-to-b from-sky-50/40 via-white to-white p-2 shadow-2xl shadow-sky-900/10">
    <CardBody className="flex flex-col gap-5 p-6 sm:p-8">
      
      {/* Sarlavha Qismi */}
      <div className="text-center">
        <Typography variant="h4" className="text-sky-950 font-extrabold tracking-tight">
          Ro'yxatdan o'tish
        </Typography>
        <Typography variant="small" className="mt-1.5 text-stone-600 font-medium leading-relaxed">
          Dasturchimisiz yoki shunchaki startap g'oyangiz bormi — ikkalasi uchun ham joy bor.
        </Typography>
      </div>

      {error && (
        <Alert color="red" className="bg-pink-50 border border-pink-200 text-pink-700 text-xs rounded-xl shadow-sm">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        <div>
          <Input
            label="To'liq ism"
            color="sky"
            {...register('fullName', { required: 'Ism kiritilishi shart' })}
            error={!!errors.fullName}
          />
          {errors.fullName && (
            <span className="mt-1 block text-xs font-semibold text-pink-600">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            color="sky"
            {...register('email', { required: 'Email kiritilishi shart' })}
            error={!!errors.email}
          />
          {errors.email && (
            <span className="mt-1 block text-xs font-semibold text-pink-600">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <Input
            label="Parol"
            type="password"
            color="sky"
            {...register('password', {
              required: 'Parol kiritilishi shart',
              minLength: { value: 6, message: 'Kamida 6 ta belgi bo\'lishi kerak' },
            })}
            error={!!errors.password}
          />
          {errors.password && (
            <span className="mt-1 block text-xs font-semibold text-pink-600">
              {errors.password.message}
            </span>
          )}
        </div>

        <div>
          <Select
            label="Kimsiz?"
            color="sky"
            onChange={(v) => setValue('category', v, { shouldValidate: true })}
            error={!!errors.category}
          >
            {CATEGORIES.map((c) => (
              <Option key={c.value} value={c.value}>
                {c.label}
              </Option>
            ))}
          </Select>
          <input type="hidden" {...register('category', { required: 'Kategoriya tanlanishi shart' })} />
          {errors.category && (
            <span className="mt-1 block text-xs font-semibold text-pink-600">
              {errors.category.message}
            </span>
          )}
        </div>

        {selectedCategory && !isRegularUser && (
          <div>
            <Select 
              label="Darajangiz" 
              color="sky"
              onChange={(v) => setValue('level', v)} 
              error={!!errors.level}
            >
              {LEVELS.map((l) => (
                <Option key={l.value} value={l.value}>
                  {l.label}
                </Option>
              ))}
            </Select>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="mt-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          loading={isLoading}
        >
          Ro'yxatdan o'tish
        </Button>
      </form>

      
      <div className="border-t border-stone-200/80 pt-4 text-center">
        <Typography variant="small" className="text-stone-600 font-medium">
          Hisobingiz bormi?{' '}
          <Link
            to="/login"
            className="font-bold text-sky-700 hover:text-pink-600 hover:underline transition-colors"
          >
            Kiring
          </Link>
        </Typography>
      </div>

    </CardBody>
  </Card>
</div>
  );
};

export default RegisterPage;

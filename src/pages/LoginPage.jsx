import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardBody, Input, Button, Typography, Alert } from '@material-tailwind/react';
import { useAuthStore } from '../store/authStore.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result?.success) {
      navigate(location.state?.from?.pathname || '/', { replace: true });
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center min-h-[80vh] px-4 py-10">
      <Card className="w-full border border-stone-200 bg-white shadow-lg">
        <CardBody className="flex flex-col gap-5 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center">
            <Typography variant="h4" className="text-sky-950 font-bold">
              Xush kelibsiz
            </Typography>
            <Typography variant="small" className="mt-1 text-stone-600">
              Jamoa qidirish yoki qo'shilish uchun hisobingizga kiring
            </Typography>
          </div>

          {/* Backend Error Alert */}
          {error && (
            <Alert color="red" className="bg-pink-50 border border-pink-200 text-pink-700 text-xs">
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <Input
                label="Email"
                type="email"
                color="sky"
                {...register('email', {
                  required: 'Email kiritilishi shart',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "To'g'ri email manzil kiriting",
                  },
                })}
                error={!!errors.email}
              />
              {errors.email && (
                <span className="mt-1 block text-xs font-medium text-pink-600">
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
                  minLength: {
                    value: 6,
                    message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
                  },
                })}
                error={!!errors.password}
              />
              {errors.password && (
                <span className="mt-1 block text-xs font-medium text-pink-600">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="bg-sky-600 hover:bg-sky-700 text-white shadow-md hover:shadow-sky-600/30 transition-all mt-2"
              loading={isLoading}
            >
              Kirish
            </Button>
          </form>

          {/* Footer */}
          <div className="border-t border-stone-100 pt-4 text-center">
            <Typography variant="small" className="text-stone-600">
              Hisobingiz yo'qmi?{' '}
              <Link
                to="/register"
                className="font-semibold text-pink-600 hover:text-pink-700 hover:underline transition-colors"
              >
                Ro'yxatdan o'ting
              </Link>
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
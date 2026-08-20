import { Link } from 'react-router-dom';
import { Button, Typography } from '@material-tailwind/react';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
    <Typography variant="h1" className="text-6xl">
      404
    </Typography>
    <Typography variant="h5">Sahifa topilmadi</Typography>
    <Typography className="text-gray-500">Siz izlagan sahifa mavjud emas yoki ko'chirilgan.</Typography>
    <Link to="/">
      <Button className="mt-2 bg-brand-600">Bosh sahifaga qaytish</Button>
    </Link>
  </div>
);

export default NotFoundPage;

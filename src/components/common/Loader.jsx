import { Spinner } from '@material-tailwind/react';

const Loader = ({ label = 'Yuklanmoqda...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
    <Spinner className="h-8 w-8" />
    <p className="text-sm">{label}</p>
  </div>
);

export default Loader;

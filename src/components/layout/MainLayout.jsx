import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useSocketEvents } from '../../hooks/useSocketEvents.js';

const MainLayout = () => {
  useSocketEvents(); // butun ilova bo'ylab real-time eventlarni tinglaydi

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

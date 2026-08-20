import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Avatar, Button, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { useAuthStore } from '../../store/authStore.js';
import NotificationBell from '../notifications/NotificationBell.jsx';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore((s) => ({
    user: s.user,
    logout: s.logout,
    isAuthenticated: s.isAuthenticated(),
  }));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold text-brand-600">
          TeamUp
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Startaplar
          </NavLink>
          <NavLink to="/developers" className={navLinkClass}>
            Dasturchilar
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/requests" className={navLinkClass}>
                So'rovlar
              </NavLink>
              <NavLink to="/messages" className={navLinkClass}>
                Xabarlar
              </NavLink>
              <NavLink to="/malumot" className={navLinkClass}>
                Ma'lumot
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Avatar
                    size="sm"
                    variant="circular"
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`}
                    alt={user?.fullName}
                    className="cursor-pointer"
                  />
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={() => navigate('/profile/me')}>Mening profilim</MenuItem>
                  <MenuItem onClick={() => navigate('/startups/new')}>Startap yaratish</MenuItem>
                  <MenuItem onClick={handleLogout} className="text-red-500">
                    Chiqish
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button variant="text" size="sm" onClick={() => navigate('/login')}>
                Kirish
              </Button>
              <Button size="sm" className="bg-brand-600" onClick={() => navigate('/register')}>
                Ro'yxatdan o'tish
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

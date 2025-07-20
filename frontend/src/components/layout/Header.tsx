import React from 'react';
import { UserIcon, LogOutIcon, ShoppingCartIcon, BellIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { currentUser } = useAuth();

  const firstName = currentUser?.nome?.split(' ')[0];

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="md:hidden">{/* Mobile menu button would go here */}</div>
      <div className="flex-1 md:text-center md:flex-none">
        <h1 className="text-xl font-medium text-emerald-700">
          Recanto das Palmeiras Digital
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-emerald-700">
          <BellIcon size={20} />
        </button>
        <Link to="/my-profile" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <UserIcon size={16} className="text-emerald-700" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">
              {firstName || currentUser?.cargo?.toLowerCase()}
            </p>
          </div>
        </Link>
        <button onClick={onLogout} className="text-gray-600 hover:text-emerald-700">
          <LogOutIcon size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
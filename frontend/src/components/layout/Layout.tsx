import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={currentUser?.cargo?.toLowerCase() ?? 'cliente' as 'gerente' | 'vendedor' | 'cliente' | null} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header userRole={currentUser?.cargo?.toLowerCase() ?? 'cliente' as 'gerente' | 'vendedor' | 'cliente' | null} onLogout={logout} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, ShoppingBagIcon, UsersIcon, ShoppingCartIcon, ClipboardListIcon, BarChartIcon, PlusCircleIcon, UserCogIcon, UserCircle } from 'lucide-react';
interface SidebarProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
}
const Sidebar: React.FC<SidebarProps> = ({
  userRole
}) => {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const renderNavItems = () => {
    if (userRole === 'gerente') {
      return <> 
          <NavItem to="/products" icon={<ShoppingBagIcon size={20} />} label="Produtos" active={isActive('/products')} />
          <NavItem to="/customers" icon={<UsersIcon size={20} />} label="Clientes" active={isActive('/customers')} />
          <NavItem to="/users" icon={<UserCogIcon size={20} />} label="Usuários" active={isActive('/users')} />
        </>;
    } else if (userRole === 'vendedor') {
      return <> 
          <NavItem to="/products" icon={<ShoppingBagIcon size={20} />} label="Catálogo" active={isActive('/products')} />
          <NavItem to="/customers" icon={<UsersIcon size={20} />} label="Clientes" active={isActive('/customers')} />
        </>;
    } else if (userRole === 'cliente') {
      return <> 
          <NavItem to="/products" icon={<ShoppingBagIcon size={20} />} label="Catálogo" active={isActive('/products')} />
          <NavItem to="/account" icon={<UserCircle size={20} />} label="Minha Conta" active={isActive('/account')} />
        </>;
    }
    return null;
  };
  return <aside className="w-64 bg-white border-r border-gray-200 h-full hidden md:block">
      <div className="p-6">
        <div className="flex items-center justify-center">
          <h2 className="text-xl font-semibold text-emerald-700">
            Recanto Digital
          </h2>
        </div>
      </div>
      <nav className="mt-6">
        <ul className="space-y-1">{renderNavItems()}</ul>
      </nav>
    </aside>;
};
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}
const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  active
}) => {
  return <li>
      <Link to={to} className={`flex items-center px-6 py-3 text-sm font-medium ${active ? 'text-emerald-700 bg-emerald-50 border-r-4 border-emerald-700' : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'}`}>
        <span className="mr-3">{icon}</span>
        {label}
      </Link>
    </li>;
};
export default Sidebar;
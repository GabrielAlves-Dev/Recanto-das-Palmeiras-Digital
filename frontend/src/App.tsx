import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductEdit from './pages/ProductEdit';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import CreateOrder from './pages/CreateOrder';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Users from './pages/Users';
import UserEdit from './pages/UserEdit';
import Layout from './components/layout/Layout';


interface ProtectedRoutesLayoutProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
  onLogout: () => void;
}

const ProtectedRoutesLayout: React.FC<ProtectedRoutesLayoutProps> = ({ userRole, onLogout }) => {
  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      <Routes>
        {/* rotas de produtos */}
        <Route path="/products" element={<Products userRole={userRole} />} />
        <Route path="/products/edit/:id" element={<ProductEdit />} />
        <Route path="/products/new" element={<ProductEdit />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        
        {/* carrinho e checkout */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* rotas de pedidos */}
        {(userRole === 'cliente' || userRole === 'vendedor' || userRole === 'gerente') && (
          <>
            <Route path="/orders" element={<Orders userRole={userRole} />} />
            <Route path="/orders/:id" element={<OrderDetails userRole={userRole} />} />
          </>
        )}
        {(userRole === 'vendedor' || userRole === 'gerente') && <Route path="/create-order" element={<CreateOrder />} />}
        
        {/* rotas de cliente (gerente e vendedor) */}
        {(userRole === 'gerente' || userRole === 'vendedor') && (
            <>
              <Route path="/customers" element={<Customers userRole={userRole} />} />
              <Route path="/customers/:id" element={<CustomerDetails userRole={userRole} />} />
            </>
        )}

        {/* Rotas de usuario (somente gerente) */}
        {userRole === 'gerente' && (
            <>
              <Route path="/users" element={<Users />} />
              <Route path="/users/new" element={<UserEdit />} />
              <Route path="/users/edit/:id" element={<UserEdit />} />
            </>
        )}
      </Routes>
    </Layout>
  );
};

export function App() {
  const [userRole, setUserRole] = useState<'gerente' | 'vendedor' | 'cliente' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = (role: 'gerente' | 'vendedor' | 'cliente') => {
    setUserRole(role);
    setIsAuthenticated(true);
  };
  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
  };
  return <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/products" replace /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        {/* Protected routes */}
        <Route path="/*" element={isAuthenticated ? <ProtectedRoutesLayout userRole={userRole} onLogout={handleLogout} /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>;
}
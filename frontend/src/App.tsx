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
import Layout from './components/layout/Layout';

interface ProtectedRoutesLayoutProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
  onLogout: () => void;
}

const ProtectedRoutesLayout: React.FC<ProtectedRoutesLayoutProps> = ({ userRole, onLogout }) => {
  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      <Routes>
        <Route path="/products" element={<Products userRole={userRole} />} />
        <Route path="/products/edit/:id" element={<ProductEdit />} />
        <Route path="/products/new" element={<ProductEdit />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        {(userRole === 'cliente' || userRole === 'vendedor') && (
          <>
            <Route path="/orders" element={<Orders userRole={userRole} />} />
            <Route path="/orders/:id" element={<OrderDetails userRole={userRole} />} />
          </>
        )}
        {userRole === 'vendedor' && <Route path="/create-order" element={<CreateOrder />} />}
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
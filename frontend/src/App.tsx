import React from 'react';
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
import { useAuth } from './services/AuthContext';
import Account from './pages/Account';


interface ProtectedRoutesLayoutProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
  onLogout: () => void;
}

const ProtectedRoutesLayout: React.FC<ProtectedRoutesLayoutProps> = ({ userRole, onLogout }) => {
  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      <Routes>
        {/* Redirect from root to products */}
        <Route path="/" element={<Navigate to="/products" replace />} />

        {/* rotas de produtos */}
        <Route path="/products" element={<Products userRole={userRole} />} />
        <Route path="/products/edit/:id" element={<ProductEdit />} />
        <Route path="/products/new" element={<ProductEdit />} />
        <Route path="/products/:id" element={<ProductDetails userRole={userRole} />} />
        
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

        {/* Rota da conta do cliente */}
        {userRole === 'cliente' && (
            <Route path="/account" element={<Account />} />
        )}

        {/* Fallback for any other authenticated route */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </Layout>
  );
};

export function App() {
  const { isAuthenticated, role, logout } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <ProtectedRoutesLayout userRole={role} onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}
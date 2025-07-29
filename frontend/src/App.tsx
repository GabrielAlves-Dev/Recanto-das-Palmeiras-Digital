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
import Unauthorized from './pages/Unauthorized';
import MyProfile from './pages/MyProfile';
import MyProfileEdit from './pages/MyProfileEdit';
import CustomerEdit from './pages/CustomerEdit';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import RoleBasedRoute from './components/RoleBasedRoute';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Alteracao para ativar o trigger */}
          {/* Alteracao para ativar o trigger */}
          
          <Route element={<Layout />}>
            
            <Route element={<RoleBasedRoute allowedRoles={['CLIENTE', 'VENDEDOR', 'GERENTE']} />}>
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/my-profile/edit" element={<MyProfileEdit />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={['VENDEDOR', 'GERENTE']} />}>
              <Route path="/products/new" element={<ProductEdit />} />
              <Route path="/products/edit/:id" element={<ProductEdit />} />
              <Route path="/create-order" element={<CreateOrder />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
               <Route path="/customers/edit/:id" element={<CustomerEdit />} />
            </Route>


            <Route element={<RoleBasedRoute allowedRoles={['GERENTE']} />}>
              <Route path="/users" element={<Users />} />
              <Route path="/users/new" element={<UserEdit />} />
              <Route path="/users/edit/:id" element={<UserEdit />} />
            </Route>

          </Route>
          

          <Route path="/" element={<Navigate to="/products" replace />} />
          
          <Route path="*" element={<Navigate to="/products" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}
import React from 'react';
import { useAuth } from '../context/AuthContext';
import CustomerDetails from './CustomerDetails';
import UserProfile from './UserProfile';

const MyProfile: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!currentUser) {
    return <div>Você precisa estar logado para ver esta página.</div>;
  }

  const isCustomer = currentUser.cargo === 'CLIENTE';

  return isCustomer ? <CustomerDetails isOwnProfile={true} /> : <UserProfile />;
};

export default MyProfile;

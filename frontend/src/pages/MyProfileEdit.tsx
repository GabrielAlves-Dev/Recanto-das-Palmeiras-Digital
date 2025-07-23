import React from 'react';
import { useAuth } from '../context/AuthContext';
import CustomerEdit from './CustomerEdit';
import UserSelfEdit from './UserSelfEdit';

const MyProfileEdit: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!currentUser) {
    return <div>Você precisa estar logado para ver esta página.</div>;
  }

  const isCustomer = currentUser.cargo === 'CLIENTE';

  return isCustomer ? <CustomerEdit isOwnProfile={true} /> : <UserSelfEdit />;
};

export default MyProfileEdit;

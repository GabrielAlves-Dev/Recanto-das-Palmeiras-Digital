import React, { useState, useEffect } from 'react';
import UserEdit from './UserEdit';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyProfileEdit = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await api('/clientes/me');
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!userData) {
    return <div>Não foi possível carregar os dados do usuário.</div>;
  }

  return <UserEdit user={userData} isProfileEdit={true} />;
};

export default MyProfileEdit;
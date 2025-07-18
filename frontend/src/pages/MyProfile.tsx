import React, { useState, useEffect } from 'react';
import CustomerDetails from './CustomerDetails';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
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

  const adaptedCustomer = {
    id: userData.id,
    name: userData.nome,
    document: userData.cpfCnpj,
    phone: userData.telefone,
    email: userData.email,
    address: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Jardim Primavera',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
    },
    active: userData.ativo,
    orderHistory: [],
  };

  return <CustomerDetails customer={adaptedCustomer} isOwnProfile={true} />;
};

export default MyProfile;
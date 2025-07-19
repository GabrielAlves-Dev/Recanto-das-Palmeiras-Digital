import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, UserIcon, PhoneIcon, MailIcon, EyeOffIcon, EditIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
}

interface BackendUserData {
    id: string;
    nome: string;
    email: string;
    cargo: string;
    ativo: boolean;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await api<BackendUserData>('/usuarios/me');
        setUser({
          id: data.id,
          name: data.nome,
          email: data.email,
          role: data.cargo,
          active: data.ativo,
        });
      } catch (err) {
        setError("Falha ao carregar dados do usuário.");
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <div className="text-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
        {error && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                {error}
            </div>
        )}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Meu Perfil
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <UserIcon size={40} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.role}</p>
              <div className="w-full mt-6 space-y-2">
                <div className="flex items-center text-gray-600">
                  <MailIcon size={16} className="mr-2" />
                  {user.email}
                </div>
              </div>
              <div className="mt-6 w-full">
                <div className="flex justify-between">
                    <Link to={`/my-profile/edit`}>
                        <Button variant="secondary">
                        <EditIcon size={16} className="mr-1" />
                        Editar Dados
                        </Button>
                    </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
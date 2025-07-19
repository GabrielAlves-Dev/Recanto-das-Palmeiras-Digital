import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ArrowLeftIcon } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface BackendUserData {
    nome: string;
    email: string;
}

const UserSelfEdit: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const data = await api<BackendUserData>('/usuarios/me');
        setFormData({
          nome: data.nome,
          email: data.email,
        });
      } catch (err) {
        console.error('Failed to fetch user data', err);
        setError('Não foi possível carregar seus dados. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api('/usuarios/me', {
        method: 'PUT',
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
        }),
      });
      navigate('/my-profile', { state: { successMessage: 'Dados atualizados com sucesso!' } });
    } catch (err: any) {
      setError(err.message || 'Falha ao atualizar os dados. Verifique as informações e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/my-profile" className="inline-flex items-center text-emerald-600 mb-4">
            <ArrowLeftIcon size={16} className="mr-1" />
            Voltar para o Perfil
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Editar Meus Dados
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Atualize suas informações cadastrais
          </p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome Completo" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                <div className="md:col-span-2">
                    <Input label="E-mail" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end mt-8">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UserSelfEdit;
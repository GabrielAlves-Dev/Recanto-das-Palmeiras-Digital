import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ArrowLeftIcon } from 'lucide-react';
import api from '../services/api';

interface BackendCustomerData {
    nome: string;
    telefone: string;
    email: string;
    cpfCnpj: string;
}

interface CustomerEditProps {
  isOwnProfile?: boolean;
}

const CustomerEdit: React.FC<CustomerEditProps> = ({ isOwnProfile = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cpfCnpj: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const endpoint = isOwnProfile ? '/clientes/me' : `/clientes/${id}`;
        const data = await api<BackendCustomerData>(endpoint);
        setFormData({
          nome: data.nome,
          telefone: data.telefone,
          email: data.email,
          cpfCnpj: data.cpfCnpj,
        });
      } catch (err) {
        console.error('Failed to fetch user data', err);
        setError('Não foi possível carregar os dados do cliente. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id || isOwnProfile) {
      fetchUserData();
    }
  }, [id, isOwnProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const endpoint = isOwnProfile ? '/clientes/me' : `/clientes/${id}`;
      await api(endpoint, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      const destination = isOwnProfile ? '/my-profile' : `/customers/${id}`;
      navigate(destination, { state: { successMessage: 'Dados atualizados com sucesso!' } });
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
          <Link to={isOwnProfile ? '/my-profile' : `/customers/${id}`} className="inline-flex items-center text-emerald-600 mb-4">
            <ArrowLeftIcon size={16} className="mr-1" />
            Voltar para Detalhes do Cliente
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Editar Dados do Cliente
          </h2>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome Completo" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                <Input
                  label="Telefone"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  mask={'(00) 00000-0000'}
                  unmask={true}
                />
                <Input label="E-mail" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                <Input label="CPF/CNPJ" id="cpfCnpj" name="cpfCnpj" value={formData.cpfCnpj} onChange={handleChange} required />
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

export default CustomerEdit;
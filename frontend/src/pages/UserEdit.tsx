import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeftIcon } from 'lucide-react';
import api from '../services/api';

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    active: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const fetchUser = async () => {
        try {
          const user = await api<any>(`/usuarios/${id}`);
          setFormData({
            name: user.nome,
            email: user.email,
            cpfCnpj: user.cpfCnpj,
            role: user.cargo,
            active: user.ativo,
            password: '',
            confirmPassword: '',
          });
        } catch (err: any) {
          console.error("Erro ao buscar usuário:", err);
          setError(err.message || "Não foi possível carregar os dados do usuário.");
        }
      };
      fetchUser();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError("As senhas não coincidem!");
      return;
    }

    const userData = {
      nome: formData.name,
      email: formData.email,
      cargo: formData.role,
      ...(formData.password && { senha: formData.password }),
    };

    try {
      const successMessage = isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!';
      if (isEditing) {
        await api(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(userData) });
      } else {
        await api('/usuarios', { method: 'POST', body: JSON.stringify({ ...userData, senha: formData.password }) });
      }
      navigate('/users', { state: { successMessage } });
    } catch (err: any) {
      setFormError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };
  
  const cpfCnpjMask = [
    {
      mask: '000.000.000-00',
      maxLength: 11
    },
    {
      mask: '00.000.000/0000-00'
    }
  ];

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Link to="/users" className="text-emerald-600 hover:text-emerald-700">
                <ArrowLeftIcon size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
            </h1>
        </div>
        {error && <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}
        <Card>
            <form onSubmit={handleSubmit}>
                 {formError && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{formError}</div>}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Dados do Usuário
                      </h3>
                    </div>
                    <Input label="Nome Completo" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input label="E-mail" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cargo
                      </label>
                      <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm"
                          required
                      >
                          <option value="">Selecione um cargo</option>
                          <option value="VENDEDOR">Vendedor</option>
                          <option value="GERENTE">Gerente</option>
                      </select>
                    </div>
                    
                    <Input
                        label={isEditing ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!isEditing}
                    />
                    <Input
                        label={isEditing ? 'Confirmar Nova Senha' : 'Confirmar Senha'}
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required={!isEditing}
                    />
                    
                    {isEditing && (
                    <div className="md:col-span-2">
                        <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                            Usuário Ativo
                        </label>
                        </div>
                    </div>
                    )}
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <Button type="button" variant="secondary" onClick={() => navigate('/users')}>
                    Cancelar
                    </Button>
                    <Button type="submit">
                    {isEditing ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                    </Button>
                </div>
            </form>
        </Card>
    </div>
  );
};

export default UserEdit;
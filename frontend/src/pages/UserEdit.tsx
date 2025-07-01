import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeftIcon } from 'lucide-react';

const UserEdit: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined;
  const [formData, setFormData] = useState({
    name: isEditing ? 'Maria Santos' : '',
    email: isEditing ? 'maria.santos@recanto.com' : '',
    cpfCnpj: isEditing ? '123.456.789-00' : '',
    role: isEditing ? 'vendedor' : '',
    password: '',
    confirmPassword: '',
    active: isEditing ? true : true
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // navega de volta
    navigate('/users');
  };
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/users" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </h1>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Dados do Usuário
              </h3>
            </div>
            <Input label="Nome Completo" id="name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="E-mail" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            <Input label="CPF/CNPJ" id="cpfCnpj" name="cpfCnpj" value={formData.cpfCnpj} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo
              </label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm" required>
                <option value="">Selecione um cargo</option>
                <option value="vendedor">Vendedor</option>
                <option value="gerente">Gerente</option>
              </select>
            </div>
            {!isEditing && <>
                <Input label="Senha" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
                <Input label="Confirmar Senha" type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required={!isEditing} />
              </>}
            {isEditing && <div className="md:col-span-2">
                <div className="flex items-center">
                  <input type="checkbox" id="active" name="active" checked={formData.active} onChange={handleChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Usuário Ativo
                  </label>
                </div>
              </div>}
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
    </div>;
};
export default UserEdit;
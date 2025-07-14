import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../services/AuthContext';
import axios from 'axios';
import { UserIcon, MailIcon, PhoneIcon, EditIcon, SaveIcon, XIcon, AlertTriangleIcon } from 'lucide-react';

const Account: React.FC = () => {
  const { user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      await axios.put(`/api/clientes/`, {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
      });
      setSuccessMessage("Dados atualizados com sucesso!");
      setIsEditing(false);
      await fetchUser();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.messages?.join(', ') || "Erro ao atualizar dados.");
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    }
  };

  const handleDeactivate = async () => {
    setError(null);
    try {
      await axios.patch(`/api/clientes/desativar`);
      logout();
      navigate('/login', { state: { successMessage: 'Sua conta foi desativada.' } });
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const errorMessage = err.response.data.messages?.join(', ') || "Não foi possível desativar a conta. Verifique se há pedidos pendentes.";
            setError(errorMessage);
        } else {
            setError("Ocorreu um erro inesperado ao tentar desativar a conta.");
        }
        setShowDeactivateConfirm(false);
    }
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Minha Conta</h1>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">{successMessage}</div>}
        <Card>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <div className="space-y-4">
                        <Input label="Nome Completo" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                        <Input label="E-mail" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        <Input label="Telefone" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required mask={'(00) 00000-0000'} unmask={true} />
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                            <XIcon size={16} className="mr-1" />
                            Cancelar
                        </Button>
                        <Button type="submit">
                            <SaveIcon size={16} className="mr-1" />
                            Salvar
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center">
                        <UserIcon size={18} className="text-emerald-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Nome Completo</p>
                            <p className="font-medium">{formData.nome}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <MailIcon size={18} className="text-emerald-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">E-mail</p>
                            <p className="font-medium">{formData.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <PhoneIcon size={18} className="text-emerald-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Telefone</p>
                            <p className="font-medium">{formData.telefone}</p>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <Button variant="secondary" onClick={() => setIsEditing(true)}>
                            <EditIcon size={16} className="mr-1" />
                            Editar Dados
                        </Button>
                    </div>
                </div>
            )}
        </Card>

        <div className="mt-8">
            <Card title="Gerenciamento da Conta">
                {showDeactivateConfirm ? (
                    <div>
                        <p className="text-sm text-gray-700 mb-4">
                            Tem certeza que deseja desativar sua conta? Você não poderá mais acessar o sistema.
                            Esta ação não pode ser desfeita através do site.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <Button variant="secondary" onClick={() => setShowDeactivateConfirm(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDeactivate}>
                                <AlertTriangleIcon size={16} className="mr-1" />
                                Sim, desativar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-medium">Desativar conta</h4>
                            <p className="text-sm text-gray-500">Esta ação é permanente e removerá seu acesso.</p>
                        </div>
                        <Button variant="danger" onClick={() => setShowDeactivateConfirm(true)}>
                            Desativar
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    </div>
  );
};

export default Account;

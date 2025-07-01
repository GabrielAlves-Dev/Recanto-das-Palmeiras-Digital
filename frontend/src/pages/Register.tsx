import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { LeafIcon, ArrowLeftIcon } from 'lucide-react';
import axios from 'axios'; // Import axios

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    document: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    try {
      const response = await axios.post('/api/clientes/auto-cadastro', {
        nome: formData.fullName,
        cpfCnpj: formData.document,
        telefone: formData.phone,
        email: formData.email,
        senha: formData.password,
      });
      if (response.status === 201) {
        alert('Cadastro realizado com sucesso!');
        navigate('/');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(`Erro no cadastro: ${error.response.data.messages.join(', ')}`);
      } else {
        alert('Ocorreu um erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-emerald-600 mb-4">
            <ArrowLeftIcon size={16} className="mr-1" />
            Voltar para login
          </Link>
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <LeafIcon size={32} className="text-emerald-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Cadastro de Cliente
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os campos abaixo para criar sua conta
          </p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome Completo" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                <Input label="CPF/CNPJ" id="document" name="document" value={formData.document} onChange={handleChange} required />
                <Input label="Telefone" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                <Input label="E-mail" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                <Input label="Senha" type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                <Input label="Confirmar Senha" type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
            <div className="flex items-center justify-between mt-8">
              <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                Cancelar
              </Button>
              <Button type="submit">Cadastrar</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
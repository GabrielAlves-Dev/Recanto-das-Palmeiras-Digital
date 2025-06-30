import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { LeafIcon, ArrowLeftIcon } from 'lucide-react';
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    document: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    // street: '',
    // number: '',
    // complement: '',
    // neighborhood: '',
    // city: '',
    // state: '',
    // zipCode: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
            {/* <div className="mb-8"> passar para o checkout depois
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="CEP" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                <Input label="Rua" id="street" name="street" value={formData.street} onChange={handleChange} required />
                <Input label="Número" id="number" name="number" value={formData.number} onChange={handleChange} required />
                <Input label="Complemento" id="complement" name="complement" value={formData.complement} onChange={handleChange} />
                <Input label="Bairro" id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange} required />
                <Input label="Cidade" id="city" name="city" value={formData.city} onChange={handleChange} required />
                <Input label="Estado" id="state" name="state" value={formData.state} onChange={handleChange} required />
              </div>
            </div> */}
            <div className="flex items-center justify-between mt-8">
              <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                Cancelar
              </Button>
              <Button type="submit">Cadastrar</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>;
};
export default Register;
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { LeafIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'; 

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(location.state?.successMessage || null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, senha);
      navigate('/products');
    } catch (err: any) {
      setError(err.message || "Falha no login. Verifique suas credenciais.");
    }
  };

  return <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <LeafIcon size={32} className="text-emerald-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Recanto das Palmeiras Digital
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para acessar sua conta
          </p>
        </div>
        {successMessage && (
            <div className="p-3 bg-green-100 text-green-700 border border-green-300 rounded-md flex items-center">
                <CheckCircleIcon className="mr-2" size={20} />
                {successMessage}
            </div>
        )}
        {error && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center">
                <XCircleIcon className="mr-2" size={20} />
                {error}
            </div>
        )}
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="E-mail" type="email" id="email" name="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Senha" type="password" id="password" name="password" placeholder="********" value={senha} onChange={e => setSenha(e.target.value)} required />
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>
            <Button type="submit" fullWidth>
              Entrar
            </Button>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>;
};

export default Login;
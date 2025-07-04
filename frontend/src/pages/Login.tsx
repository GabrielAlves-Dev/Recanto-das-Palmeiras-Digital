import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Input } from '../components/ui/Input';import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { LeafIcon, CheckCircleIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'gerente' | 'vendedor' | 'cliente') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(location.state?.successMessage || null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, different emails login as different roles
    if (email.includes('gerente')) {
      onLogin('gerente');
    } else if (email.includes('vendedor')) {
      onLogin('vendedor');
    } else {
      onLogin('cliente');
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
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="E-mail" type="email" id="email" name="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Senha" type="password" id="password" name="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} required />
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
              <div className="mt-4 text-sm text-gray-500">
                <p>Para demonstração:</p>
                <p>
                  Use "gerente@email.com", "vendedor@email.com", ou qualquer
                  outro e-mail
                </p>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>;
};

export default Login;
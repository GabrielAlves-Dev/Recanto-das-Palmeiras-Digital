import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
import axios from 'axios';

interface BackendProduct {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  imagem: string | null;
  ativo: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
}

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    active: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      setPageError(null);
      axios.get<BackendProduct>(`/api/produtos/${id}`)
        .then(response => {
          const product = response.data;
          setFormData({
            name: product.nome,
            description: product.descricao,
            price: product.preco.toFixed(2),
            stock: String(product.quantidade),
            active: product.ativo,
          });
          if (product.imagem) {
            setImagePreview(product.imagem);
          }
        })
        .catch(err => {
          console.error("Erro ao buscar produto:", err);
          setPageError('Falha ao carregar dados do produto. Verifique o ID e tente novamente.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  // const validateForm = (): boolean => { temos que ver se não vamos precisar disso dps
  //   const newErrors: FormErrors = {};
  //   if (!formData.name.trim()) {
  //     newErrors.name = 'O nome do produto é obrigatório.';
  //   }
  //   if (!formData.description.trim()) {
  //     newErrors.description = 'A descrição é obrigatória.';
  //   }
  //   if (!formData.price) {
  //     newErrors.price = 'O preço é obrigatório.';
  //   } else if (parseFloat(formData.price) <= 0) {
  //     newErrors.price = 'O preço deve ser maior que zero.';
  //   }
  //   if (!formData.stock) {
  //     newErrors.stock = 'A quantidade em estoque é obrigatória.';
  //   } else if (parseInt(formData.stock, 10) < 0) {
  //     newErrors.stock = 'A quantidade não pode ser negativa.';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageError(null);

    // if (!validateForm()) {
    //     // return;
    // }

    setIsLoading(true);

    const formDataPayload = new FormData();
    formDataPayload.append('nome', formData.name);
    formDataPayload.append('descricao', formData.description);
    formDataPayload.append('preco', formData.price);
    formDataPayload.append('quantidade', formData.stock);

    if (imageFile) {
        formDataPayload.append('imagem', imageFile);
    }

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        if (isEditing && id) {
            await axios.put(`/api/produtos/${id}`, formDataPayload, config);
        } else {
            await axios.post('/api/produtos', formDataPayload, config);
        }
        navigate('/products');
    } catch (err) {
        console.error("Erro ao salvar produto:", err);
        if (axios.isAxiosError(err) && err.response) {
            const errorData = err.response.data;
            // A mensagem de erro agora é extraída diretamente da resposta do backend
            const messages = errorData.messages || ['Ocorreu um erro. Verifique os dados e tente novamente.'];
            setPageError(messages.join(' '));
        } else {
            setPageError('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        }
    } finally {
        setIsLoading(false);
    }
};


  if (isEditing && isLoading && !formData.name) {
    return <div className="text-center py-10">Carregando dados do produto...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Editar Produto' : 'Cadastrar Produto'}
        </h1>
      </div>
      <Card>
        <form onSubmit={handleSubmit} noValidate>
          {pageError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
              {pageError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Nome do Produto" id="name" name="name" value={formData.name} onChange={handleChange} disabled={isLoading} error={errors.name} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className={`px-3 py-2 bg-white border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm`} disabled={isLoading} />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            <Input label="Preço (R$)" id="price" name="price" type="number" value={formData.price} onChange={handleChange} disabled={isLoading} error={errors.price} />
            <Input label="Quantidade em Estoque" id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} disabled={isLoading} error={errors.stock} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem do Produto
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview ? (
                  <div className="w-24 h-24 rounded-md overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>
                )}
                <input type="file" id="imageFile" name="imageFile" onChange={handleFileChange} className="flex-1" disabled={isLoading} />
              </div>
            </div>
            {isEditing && (
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input type="checkbox" id="active" name="active" checked={formData.active} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" disabled={true} />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Produto Ativo (status gerenciado na tela de produtos)
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <Button type="button" variant="secondary" onClick={() => navigate('/products')} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isEditing ? 'Salvando...' : 'Cadastrando...') : (isEditing ? 'Salvar Alterações' : 'Cadastrar Produto')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProductEdit;
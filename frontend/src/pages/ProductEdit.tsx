import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
import api from '../services/api';

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      const fetchProduct = async () => {
        try {
          const product = await api<any>(`/produtos/${id}`);
          setFormData({
            name: product.nome,
            description: product.descricao,
            price: product.preco.toString(),
            stock: product.quantidade.toString(),
            active: product.ativo,
          });
          if (product.imagem) {
            setImagePreview(product.imagem);
          }
        } catch (err: any) {
          console.error("Erro ao buscar produto:", err);
          setFormError(err.message || "Não foi possível carregar os dados do produto.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    const apiFormData = new FormData();
    apiFormData.append('nome', formData.name);
    apiFormData.append('descricao', formData.description);
    apiFormData.append('preco', formData.price);
    apiFormData.append('quantidade', formData.stock);
    if (imageFile) {
      apiFormData.append('imagem', imageFile);
    }

    try {
      if (isEditing) {
        await api(`/produtos/${id}`, {
          method: 'PUT',
          body: apiFormData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api('/produtos', {
          method: 'POST',
          body: apiFormData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      navigate('/products');
    } catch (err: any) {
      setFormError(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) {
    return <div className="text-center py-10">Carregando...</div>;
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
        <form onSubmit={handleSubmit}>
          {formError && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{formError}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Nome do Produto" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm"
              />
            </div>
            <Input label="Preço (R$)" id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
            <Input label="Quantidade em Estoque" id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
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
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button type="button" variant="secondary" onClick={handleButtonClick}>
                  Selecionar Imagem
                </Button>
              </div>
            </div>
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
                  Produto Ativo
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <Button type="button" variant="secondary" onClick={() => navigate('/products')} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Cadastrar Produto')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProductEdit;
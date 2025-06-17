import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
const ProductEdit: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined;
  const [formData, setFormData] = useState({
    name: isEditing ? 'Arranjo de Rosas' : '',
    description: isEditing ? 'Lindo arranjo com uma dúzia de rosas vermelhas.' : '',
    price: isEditing ? '70.00' : '',
    resellerPrice: isEditing ? '55.00' : '',
    stock: isEditing ? '15' : '',
    category: isEditing ? 'arrangements' : '',
    active: isEditing ? true : true,
    image: isEditing ? '' : ''
  });
  const categories = [{
    id: 'bouquets',
    name: 'Buquês'
  }, {
    id: 'arrangements',
    name: 'Arranjos'
  }, {
    id: 'plants',
    name: 'Plantas'
  }, {
    id: 'gifts',
    name: 'Presentes'
  }];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    // For demo purposes, just navigate back
    navigate('/products');
  };
  return <div className="space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Nome do Produto" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm" />
            </div>
            <Input label="Preço (R$)" id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
            <Input label="Preço para Revenda (R$)" id="resellerPrice" name="resellerPrice" type="number" step="0.01" value={formData.resellerPrice} onChange={handleChange} required />
            <Input label="Quantidade em Estoque" id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm" required>
                <option value="">Selecione uma categoria</option>
                {categories.map(category => <option key={category.id} value={category.id}>
                    {category.name}
                  </option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem do Produto
              </label>
              <div className="flex items-center space-x-4">
                {formData.image ? <div className="w-24 h-24 rounded-md overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div> : <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>}
                <Button type="button" variant="secondary">
                  Selecionar Imagem
                </Button>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input type="checkbox" id="active" name="active" checked={formData.active} onChange={handleChange} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Produto Ativo
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <Button type="button" variant="secondary" onClick={() => navigate('/products')}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </Button>
          </div>
        </form>
      </Card>
    </div>;
};
export default ProductEdit;
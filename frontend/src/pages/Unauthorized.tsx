import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div>
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para visualizar esta página.</p>
      <Link to="/products">Voltar para a página de produtos</Link>
    </div>
  );
};

export default Unauthorized;
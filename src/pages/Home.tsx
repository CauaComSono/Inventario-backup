import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="button-grid">
        <button 
          className="menu-button"
          onClick={() => navigate('/client')}
        >
          Cliente
        </button>

        <button 
          className="menu-button"
          onClick={() => navigate('/fornecedor')}
        >
          Fornecedor
        </button>

        <button 
          className="menu-button"
          onClick={() => navigate('/itemPedido')}
        >
          Item Pedido
        </button>
        
        <button 
          className="menu-button"
          onClick={() => navigate('/order')}
        >
          Pedidos
        </button>

        <button className='menu-button'
        onClick={() => navigate('/produto')}
        >
          Produto
        </button>

        <button className="menu-button"
        onClick={() => navigate('/transacao')}
        >
          Transação
        </button>
      </div>
    </div>
  );
}
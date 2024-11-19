export type Pedido = {
    id: number;
    data: string;
    clienteId: number;
    status: string;
    total: number;
  };
  
  const PedidoService = {
    listPedidos: async (): Promise<Pedido[]> => {
      const response = await fetch("http://localhost:8080/api/v1/pedido/get");
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao carregar pedidos: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    addPedido: async (pedido: Partial<Pedido>): Promise<Pedido> => {
      const response = await fetch("http://localhost:8080/api/v1/pedido/add", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: pedido.data,
          clienteId: pedido.clienteId,
          status: pedido.status,
          total: pedido.total,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao adicionar pedido: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    updatePedido: async (pedido: Pedido): Promise<Pedido> => {
      const response = await fetch(`http://localhost:8080/api/v1/pedido/${pedido.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: pedido.data,
          clienteId: pedido.clienteId,
          status: pedido.status,
          total: pedido.total,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao atualizar pedido: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    deletePedido: async (id: number): Promise<void> => {
      const response = await fetch(`http://localhost:8080/api/v1/pedido/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao excluir pedido: ${errorMessage.error}`);
      }
    },
  };
  
  export default PedidoService;
  
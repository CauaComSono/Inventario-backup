export type ItemPedido = {
    id: number;
    pedidoId: number;
    produtoId: number;
    quantidade: number;
    precoUnitario: number;
  };
  
  const ItemPedidoService = {
    listItensPedido: async (): Promise<ItemPedido[]> => {
      const response = await fetch("http://localhost:8080/api/v1/itemPedido/get");
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao carregar itens do pedido: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    addItemPedido: async (itemPedido: Partial<ItemPedido>): Promise<ItemPedido> => {
      const response = await fetch("http://localhost:8080/api/v1/itemPedido/add", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pedidoId: itemPedido.pedidoId,
          produtoId: itemPedido.produtoId,
          quantidade: itemPedido.quantidade,
          precoUnitario: itemPedido.precoUnitario,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao adicionar item ao pedido: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    updateItemPedido: async (itemPedido: ItemPedido): Promise<ItemPedido> => {
      const response = await fetch(`http://localhost:8080/api/v1/itemPedido/${itemPedido.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pedidoId: itemPedido.pedidoId,
          produtoId: itemPedido.produtoId,
          quantidade: itemPedido.quantidade,
          precoUnitario: itemPedido.precoUnitario,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao atualizar item do pedido: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    deleteItemPedido: async (id: number): Promise<void> => {
      const response = await fetch(`http://localhost:8080/api/v1/itemPedido/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao excluir item do pedido: ${errorMessage.error}`);
      }
    },
  };
  
  export default ItemPedidoService;
  
export type Transacao = {
    id: number;
    data: string;
    tipo: string;
    valor: number;
    produtoId?: number;
    pedidoId?: number;
  };
  
  const TransacaoService = {
    listTransacoes: async (): Promise<Transacao[]> => {
      const response = await fetch("http://localhost:8080/api/v1/transacao/get");
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao carregar transações: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    addTransacao: async (transacao: Partial<Transacao>): Promise<Transacao> => {
      const response = await fetch("http://localhost:8080/api/v1/transacao/add", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: transacao.data,
          tipo: transacao.tipo,
          valor: transacao.valor,
          produtoId: transacao.produtoId,
          pedidoId: transacao.pedidoId,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao adicionar transação: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    updateTransacao: async (transacao: Transacao): Promise<Transacao> => {
      const response = await fetch(`http://localhost:8080/api/v1/transacao/${transacao.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: transacao.data,
          tipo: transacao.tipo,
          valor: transacao.valor,
          produtoId: transacao.produtoId,
          pedidoId: transacao.pedidoId,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao atualizar transação: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    deleteTransacao: async (id: number): Promise<void> => {
      const response = await fetch(`http://localhost:8080/api/v1/transacao/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao excluir transação: ${errorMessage.error}`);
      }
    },
  };
  
  export default TransacaoService;
  
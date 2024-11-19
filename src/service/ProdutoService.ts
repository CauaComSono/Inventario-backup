export type Produto = {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    imagem?: string;
    fornecedorId: number;
  };
  
  const ProdutoService = {
    listProdutos: async (): Promise<Produto[]> => {
      const response = await fetch("http://localhost:8080/api/v1/produto/get");
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao carregar produtos: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    addProduto: async (produto: Partial<Produto>): Promise<Produto> => {
      const response = await fetch("http://localhost:8080/api/v1/produto/add", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: produto.nome,
          descricao: produto.descricao,
          preco: produto.preco,
          quantidade: produto.quantidade,
          fornecedorId: produto.fornecedorId,
          imagem: produto.imagem,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao adicionar produto: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    updateProduto: async (produto: Produto): Promise<Produto> => {
      const response = await fetch(`http://localhost:8080/api/v1/produto/${produto.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: produto.nome,
          descricao: produto.descricao,
          preco: produto.preco,
          quantidade: produto.quantidade,
          fornecedorId: produto.fornecedorId,
          imagem: produto.imagem,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao atualizar produto: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    deleteProduto: async (id: number): Promise<void> => {
      const response = await fetch(`http://localhost:8080/api/v1/produto/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao excluir produto: ${errorMessage.error}`);
      }
    },
  };
  
  export default ProdutoService;
  
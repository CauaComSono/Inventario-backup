export type Fornecedor = {
    id: number;
    nome: string;
    cnpj: string;
    contato: string;
    endereco: string;
  };

export const FornecedorService = {
    listFornecedores: async (): Promise<Fornecedor[]> => {
        const response = await fetch("http://localhost:8080/api/v1/fornecedor/get");
        if (!response.ok) {
            throw new Error('Erro ao carregar fornecedores');
        }
        return response.json();
    },
    
    addFornecedor: async (fornecedor: Partial<Fornecedor>): Promise<Fornecedor> => {
        const response = await fetch("http://localhost:8080/api/v1/fornecedor/add", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: fornecedor.nome,
                cnpj: fornecedor.cnpj,
                contato: fornecedor.contato,
                endereco: fornecedor.endereco,
            }),
        });
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`Erro ao adicionar fornecedor: ${errorMessage.error}`);
        }
        return response.json();
    },

    updateFornecedor: async (fornecedor: Fornecedor): Promise<Fornecedor> => {
        const response = await fetch(`http://localhost:8080/api/v1/fornecedor/${fornecedor.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: fornecedor.nome,
                cnpj: fornecedor.cnpj,
                contato: fornecedor.contato,
                endereco: fornecedor.endereco,
            }),
        });
        
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`Erro ao atualizar fornecedor: ${errorMessage.error}`);
        }
        return response.json();
    },

    deleteFornecedor: async (id: number): Promise<void> => {
        const response = await fetch(`http://localhost:8080/api/v1/fornecedor/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`Erro ao excluir fornecedor: ${errorMessage.error}`);
        }
    },
};

export type Cliente = {
    id: number;
    nome: string;
    cpf_cnpj: string;
    contato: string;
    endereco: string;
};

const ClienteService = {
    listClientes: async (): Promise<Cliente[]> => {
        const response = await fetch("http://localhost:8080/api/v1/cliente/get");
        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`Erro ao carregar clientes: ${errorMessage.error}`);
        }
        return response.json();
    },

    addCliente: async (cliente: Partial<Cliente>): Promise<Cliente> => {
        const response = await fetch("http://localhost:8080/api/v1/cliente/add", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: cliente.nome,
                cpf_cnpj: cliente.cpf_cnpj,
                contato: cliente.contato,
                endereco: cliente.endereco,
            }),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`Erro ao adicionar cliente: ${errorMessage.error}`);
        }
        return response.json();
    },

    updateCliente: async (cliente: Cliente): Promise<Cliente> => {
        const response = await fetch(`http://localhost:8080/api/v1/cliente/${cliente.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: cliente.nome,
                cpf_cnpj: cliente.cpf_cnpj,
                contato: cliente.contato,
                endereco: cliente.endereco,
            }),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`Erro ao atualizar cliente: ${errorMessage.error}`);
        }
        return response.json();
    },

    deleteCliente: async (id: number): Promise<void> => {
        const response = await fetch(`http://localhost:8080/api/v1/cliente/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`Erro ao excluir cliente: ${errorMessage.error}`);
        }
    },
};
export default ClienteService;

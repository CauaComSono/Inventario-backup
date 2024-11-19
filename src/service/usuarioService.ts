export type Usuario = {
    id: number;
    nome: string;
    email: string;
    senha: string;
  };
  
  const UsuarioService = {
    listUsuarios: async (): Promise<Usuario[]> => {
      const response = await fetch("http://localhost:8080/api/v1/usuario/get");
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao carregar usuários: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    addUsuario: async (usuario: Partial<Usuario>): Promise<Usuario> => {
      const response = await fetch("http://localhost:8080/api/v1/usuario/add", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao adicionar usuário: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    updateUsuario: async (usuario: Usuario): Promise<Usuario> => {
      const response = await fetch(`http://localhost:8080/api/v1/usuario/${usuario.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao atualizar usuário: ${errorMessage.error}`);
      }
      return response.json();
    },
  
    deleteUsuario: async (id: number): Promise<void> => {
      const response = await fetch(`http://localhost:8080/api/v1/usuario/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`Erro ao excluir usuário: ${errorMessage.error}`);
      }
    },
  };
  
  export default UsuarioService;
  
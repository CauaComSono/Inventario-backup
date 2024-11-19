import React, { useEffect, useState } from "react";
import { FornecedorService } from "@/service/fornecedorService"; 
import { Button } from "@/components/ui/button";
import { Input } from "../ui/Input";
import Table from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import Notification from "@/components/ui/notification";

import "./fornecedor.css";
import "./modal.css";

export type Fornecedor = {
  id: number;
  nome: string;
  cnpj: string;
  contato: string;
  endereco: string;
};

const GerenciamentoFornecedores: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [fornecedoresFiltrados, setFornecedoresFiltrados] = useState<Fornecedor[]>([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [buscaNome, setBuscaNome] = useState('');
  const [buscaCnpj, setBuscaCnpj] = useState('');
  const [notificacao, setNotificacao] = useState<{ mensagem: string; tipo: "sucesso" | "erro" } | null>(null);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    buscarFornecedores();
  }, []);

  useEffect(() => {
    const filtrados = fornecedores.filter(fornecedor =>
      fornecedor.nome.toLowerCase().includes(buscaNome.toLowerCase()) &&
      fornecedor.cnpj.includes(buscaCnpj)
    );
    setFornecedoresFiltrados(filtrados);
  }, [buscaNome, buscaCnpj, fornecedores]);

  useEffect(() => {
    if (notificacao) {
      const timer = setTimeout(() => {
        setNotificacao(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notificacao]);

  const buscarFornecedores = async () => {
    try {
      const dados = await FornecedorService.listFornecedores();
      console.log("Dados carregados: ", dados);
      setFornecedores(dados);
      setFornecedoresFiltrados(dados);
    } catch (error) {
      setNotificacao({ mensagem: 'Erro ao carregar fornecedores.', tipo: 'erro' });
    }
  };

  const handleAdicionarFornecedor = () => {
    setFornecedorSelecionado({ id: 0, nome: '', cnpj: '', contato: '', endereco: '' });
    setModalAberto(true);
    setError(null);
  };

  const handleEditarFornecedor = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setModalAberto(true);
    setError(null);
  };

  const handleDeletarFornecedor = (id: number) => {
    if (window.confirm("Você tem certeza que deseja deletar este fornecedor?")) {
      setFornecedores(fornecedores.filter(fornecedor => fornecedor.id !== id));
      setNotificacao({ mensagem: "Fornecedor deletado com sucesso.", tipo: "sucesso" });
    }
  };

  const handleSalvarFornecedor = () => {
    if (fornecedorSelecionado) {
      const { nome, cnpj, contato } = fornecedorSelecionado;

      if (!nome || !cnpj || !contato) {
        setError('Nome, CNPJ e Contato são obrigatórios.');
        return;
      }

      const cnpjExists = fornecedores.some(fornecedor => fornecedor.cnpj === cnpj && fornecedor.id !== fornecedorSelecionado.id);
      if (cnpjExists) {
        setError('CNPJ já cadastrado.');
        return;
      }

      if (fornecedorSelecionado.id === 0) {
        setFornecedores([...fornecedores, { ...fornecedorSelecionado, id: fornecedores.length + 1 }]);
        setNotificacao({ mensagem: "Fornecedor adicionado com sucesso.", tipo: "sucesso" });
      } else {
        setFornecedores(fornecedores.map(fornecedor => (fornecedor.id === fornecedorSelecionado.id ? fornecedorSelecionado : fornecedor)));
        setNotificacao({ mensagem: "Fornecedor atualizado com sucesso.", tipo: "sucesso" });
      }
      setModalAberto(false);
      setFornecedorSelecionado(null);
      setError(null);
    }
  };

  return (
    <div>
      <h1>Gerenciamento de Fornecedores</h1>
      {notificacao && <Notification mensagem={notificacao.mensagem} tipo={notificacao.tipo} onClose={() => setNotificacao(null)} />}
      
      {error && <div className="error-message">{error}</div>}
      
      <Input placeholder="Buscar por nome" value={buscaNome} onChange={(e) => setBuscaNome(e.target.value)} />
      <Input placeholder="Buscar por CNPJ" value={buscaCnpj} onChange={(e) => setBuscaCnpj(e.target.value)} />
      
      <div className="button-container">
        <Button className="mr-2" onClick={() => {}}>Buscar</Button>
        <Button onClick={handleAdicionarFornecedor}>Adicionar Fornecedor</Button>
      </div>

      <div className="overflow-auto h-96 border border-gray-200 rounded">
        <Table head={
          <>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Contato</th>
            <th>Endereço</th>
            <th>Ações</th>
          </>
        }>
          {fornecedoresFiltrados.map(fornecedor => (
            <tr key={fornecedor.id}>
              <td>{fornecedor.nome}</td>
              <td>{fornecedor.cnpj}</td>
              <td>{fornecedor.contato}</td>
              <td>{fornecedor.endereco}</td>
              <td>
                <Button className="mr-2" onClick={() => handleEditarFornecedor(fornecedor)}>Editar</Button>
                <Button className="delete" onClick={() => handleDeletarFornecedor(fornecedor.id)}>Deletar</Button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {modalAberto && (
        <Modal open={modalAberto} onClose={() => setModalAberto(false)}>
          <h3 className="modal-title">
            {fornecedorSelecionado?.id === 0 ? 'Adicionar Fornecedor' : 'Editar Fornecedor'}
          </h3>
          <div className="modal-content">
            {error && <div className="error-message">{error}</div>} {}
            <Input
              placeholder="Nome"
              value={fornecedorSelecionado?.nome}
              onChange={(e) => setFornecedorSelecionado({ ...fornecedorSelecionado!, nome: e.target.value })}
            />
            <Input
              mask="99.999.999/9999-99" 
              placeholder="CNPJ"
              value={fornecedorSelecionado?.cnpj}
              onChange={(e) => setFornecedorSelecionado({ ...fornecedorSelecionado!, cnpj: e.target.value })}
            />
            <Input
              placeholder="Contato"
              value={fornecedorSelecionado?.contato}
              onChange={(e) => setFornecedorSelecionado({ ...fornecedorSelecionado!, contato: e.target.value })}
            />
            <Input
              placeholder="Endereço"
              value={fornecedorSelecionado?.endereco}
              onChange={(e) => setFornecedorSelecionado({ ...fornecedorSelecionado!, endereco: e.target.value })}
            />
            <Button className="save" onClick={handleSalvarFornecedor}>
              Salvar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GerenciamentoFornecedores;

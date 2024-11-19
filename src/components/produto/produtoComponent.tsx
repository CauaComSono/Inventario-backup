import React, { useEffect, useState } from "react";
import ProdutoService from "@/service/ProdutoService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/modal";
import Table from "@/components/ui/table";
import Notification from "@/components/ui/notification";

import "./produto.css";
import "./modal.css";

export type Produto = {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    imagem?: string;
    fornecedorId: number;
  };

const GerenciamentoProdutos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [notificacao, setNotificacao] = useState<{ mensagem: string; tipo: "sucesso" | "erro" } | null>(null);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroFornecedor, setFiltroFornecedor] = useState<number | null>(null);
  const [ordemPreco, setOrdemPreco] = useState<"asc" | "desc" | null>(null);
  const [arquivoImagem, setArquivoImagem] = useState<File | null>(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    let produtosAtualizados = [...produtos];

    if (filtroNome) {
      produtosAtualizados = produtosAtualizados.filter((p) =>
        p.nome.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }

    if (filtroFornecedor) {
      produtosAtualizados = produtosAtualizados.filter((p) => p.fornecedorId === filtroFornecedor);
    }

    if (ordemPreco) {
      produtosAtualizados.sort((a, b) =>
        ordemPreco === "asc" ? a.preco - b.preco : b.preco - a.preco
      );
    }

    setProdutosFiltrados(produtosAtualizados);
  }, [filtroNome, filtroFornecedor, ordemPreco, produtos]);

  const carregarProdutos = async () => {
    try {
      const dados = await ProdutoService.listProdutos();
      setProdutos(dados);
      setProdutosFiltrados(dados);
    } catch (erro: any) {
      setNotificacao({ mensagem: erro.message, tipo: "erro" });
    }
  };

  const handleSalvarProduto = async () => {
    if (produtoSelecionado) {
      try {
        if (produtoSelecionado.id === 0) {
          const novoProduto = await ProdutoService.addProduto(produtoSelecionado);
          setProdutos([...produtos, novoProduto]);
        } else {
          const produtoAtualizado = await ProdutoService.updateProduto(produtoSelecionado);
          setProdutos(
            produtos.map((p) => (p.id === produtoAtualizado.id ? produtoAtualizado : p))
          );
        }
        setNotificacao({ mensagem: "Produto salvo com sucesso.", tipo: "sucesso" });
        fecharModal();
      } catch (erro: any) {
        setNotificacao({ mensagem: erro.message, tipo: "erro" });
      }
    }
  };

  const handleDeletarProduto = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await ProdutoService.deleteProduto(id);
        setProdutos(produtos.filter((p) => p.id !== id));
        setNotificacao({ mensagem: "Produto excluído com sucesso.", tipo: "sucesso" });
      } catch (erro: any) {
        setNotificacao({ mensagem: erro.message, tipo: "erro" });
      }
    }
  };

  const abrirModal = (produto: Produto | null) => {
    setProdutoSelecionado(produto || { id: 0, nome: "", descricao: "", preco: 0, quantidade: 0, fornecedorId: 0 });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProdutoSelecionado(null);
    setArquivoImagem(null);
  };

  return (
    <div>
      <h1>Gerenciamento de Produtos</h1>
      {notificacao && (
        <Notification mensagem={notificacao.mensagem} tipo={notificacao.tipo} onClose={() => setNotificacao(null)} />
      )}

      <div className="filtros">
        <Input
          placeholder="Filtrar por nome"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
        />
        <Input
          placeholder="Filtrar por fornecedor (ID)"
          value={filtroFornecedor || ""}
          onChange={(e) => setFiltroFornecedor(Number(e.target.value) || null)}
        />
        <Button onClick={() => setOrdemPreco(ordemPreco === "asc" ? "desc" : "asc")}>
          Ordenar por Preço ({ordemPreco || "nenhum"})
        </Button>
      </div>

      <Button onClick={() => abrirModal(null)}>Adicionar Produto</Button>

      <Table
        head={
          <>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Fornecedor</th>
            <th>Ações</th>
          </>
        }
      >
        {produtosFiltrados.map((produto) => (
          <tr key={produto.id}>
            <td>{produto.nome}</td>
            <td>{produto.descricao}</td>
            <td>{produto.preco.toFixed(2)}</td>
            <td>{produto.fornecedorId}</td>
            <td>
              <Button onClick={() => abrirModal(produto)}>Editar</Button>
              <Button onClick={() => handleDeletarProduto(produto.id)}>Excluir</Button>
            </td>
          </tr>
        ))}
      </Table>

      {modalAberto && (
  <Modal open={modalAberto} onClose={fecharModal}>
    <h3>{produtoSelecionado?.id === 0 ? "Adicionar Produto" : "Editar Produto"}</h3>
    <Input
      placeholder="Nome"
      type="text"
      value={produtoSelecionado?.nome || ""}
      onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado!, nome: e.target.value })}
    />
    <Input
      placeholder="Descrição"
      type="text"
      value={produtoSelecionado?.descricao || ""}
      onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado!, descricao: e.target.value })}
    />
    <Input
      placeholder="Preço"
      type="number"
      value={produtoSelecionado?.preco || ""}
      onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado!, preco: Number(e.target.value) })}
    />
    <Input
      placeholder="Quantidade"
      type="number"
      value={produtoSelecionado?.quantidade || ""}
      onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado!, quantidade: Number(e.target.value) })}
    />
    <Input
      placeholder="Fornecedor ID"
      type="number"
      value={produtoSelecionado?.fornecedorId || ""}
      onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado!, fornecedorId: Number(e.target.value) })}
    />
    <Input type="file" onChange={(e) => setArquivoImagem(e.target.files?.[0] || null)} />
    <Button onClick={handleSalvarProduto}>Salvar</Button>
  </Modal>
)}

    </div>
  );
};

export default GerenciamentoProdutos;

import React, { useEffect, useState } from "react";
import TransacaoService from "@/service/transacaoService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/modal";
import Table from "@/components/ui/table";
import Notification from "@/components/ui/notification";

import "./transacao.css";
import "./modal.css";

export type Transacao = {
    id: number;
    data: string;
    tipo: string;
    valor: number;
    produtoId?: number;
    pedidoId?: number;
};

const GerenciamentoTransacoes: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [transacoesFiltradas, setTransacoesFiltradas] = useState<Transacao[]>([]);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<Transacao | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [notificacao, setNotificacao] = useState<{ mensagem: string; tipo: "sucesso" | "erro" } | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [filtroData, setFiltroData] = useState<string>("");

  useEffect(() => {
    carregarTransacoes();
  }, []);

  useEffect(() => {
    let transacoesAtualizadas = [...transacoes];

    if (filtroTipo) {
      transacoesAtualizadas = transacoesAtualizadas.filter((t) => t.tipo === filtroTipo);
    }

    if (filtroData) {
      transacoesAtualizadas = transacoesAtualizadas.filter((t) => t.data.includes(filtroData));
    }

    setTransacoesFiltradas(transacoesAtualizadas);
  }, [filtroTipo, filtroData, transacoes]);

  const carregarTransacoes = async () => {
    try {
      const dados = await TransacaoService.listTransacoes();
      setTransacoes(dados);
      setTransacoesFiltradas(dados);
    } catch (erro: any) {
      setNotificacao({ mensagem: erro.message, tipo: "erro" });
    }
  };

  const handleSalvarTransacao = async () => {
    if (transacaoSelecionada) {
      // Validar tipo de transação
      if (transacaoSelecionada.tipo !== "E" && transacaoSelecionada.tipo !== "S") {
        setTransacaoSelecionada({ ...transacaoSelecionada, tipo: "" }); // Limpar o campo tipo
        alert("Tipo inválido. Use 'E' para entrada ou 'S' para saída.");
        return; // Não continuar o salvamento
      }

      try {
        if (transacaoSelecionada.id === 0) {
          const novaTransacao = await TransacaoService.addTransacao(transacaoSelecionada);
          setTransacoes([...transacoes, novaTransacao]);
        } else {
          const transacaoAtualizada = await TransacaoService.updateTransacao(transacaoSelecionada);
          setTransacoes(
            transacoes.map((t) => (t.id === transacaoAtualizada.id ? transacaoAtualizada : t))
          );
        }
        setNotificacao({ mensagem: "Transação salva com sucesso.", tipo: "sucesso" });
        fecharModal();
      } catch (erro: any) {
        setNotificacao({ mensagem: erro.message, tipo: "erro" });
      }
    }
  };

  const handleDeletarTransacao = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await TransacaoService.deleteTransacao(id);
        setTransacoes(transacoes.filter((t) => t.id !== id));
        setNotificacao({ mensagem: "Transação excluída com sucesso.", tipo: "sucesso" });
      } catch (erro: any) {
        setNotificacao({ mensagem: erro.message, tipo: "erro" });
      }
    }
  };

  const abrirModal = (transacao: Transacao | null) => {
    setTransacaoSelecionada(transacao || { id: 0, data: "", tipo: "", valor: 0, produtoId: undefined, pedidoId: undefined });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setTransacaoSelecionada(null);
  };

  return (
    <div>
      <h1>Gerenciamento de Transações</h1>
      {notificacao && (
        <Notification mensagem={notificacao.mensagem} tipo={notificacao.tipo} onClose={() => setNotificacao(null)} />
      )}

      <div className="filtros">
        <Input
          placeholder="Filtrar por tipo (E para entrada / S para saída)"
          value={filtroTipo || ""}
          onChange={(e) => setFiltroTipo(e.target.value || null)}
        />
        <Input
          placeholder="Filtrar por data"
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />
      </div>

      <Button onClick={() => abrirModal(null)}>Adicionar Transação</Button>

      <Table
        head={
          <>
            <th>Data</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Produto ID</th>
            <th>Pedido ID</th>
            <th>Ações</th>
          </>
        }
      >
        {transacoesFiltradas.map((transacao) => (
          <tr key={transacao.id}>
            <td>{transacao.data}</td>
            <td>{transacao.tipo}</td>
            <td>{transacao.valor.toFixed(2)}</td>
            <td>{transacao.produtoId}</td>
            <td>{transacao.pedidoId}</td>
            <td>
              <Button onClick={() => abrirModal(transacao)}>Editar</Button>
              <Button onClick={() => handleDeletarTransacao(transacao.id)}>Excluir</Button>
            </td>
          </tr>
        ))}
      </Table>

      {modalAberto && (
        <Modal open={modalAberto} onClose={fecharModal}>
          <h3>{transacaoSelecionada?.id === 0 ? "Adicionar Transação" : "Editar Transação"}</h3>
          <Input
            placeholder="Data"
            type="date"
            value={transacaoSelecionada?.data || ""}
            onChange={(e) => setTransacaoSelecionada({ ...transacaoSelecionada!, data: e.target.value })}
          />
          <Input
            placeholder="Tipo (E para entrada, S para saída)"
            value={transacaoSelecionada?.tipo || ""}
            onChange={(e) => setTransacaoSelecionada({ ...transacaoSelecionada!, tipo: e.target.value })}
          />
          <Input
            placeholder="Valor"
            type="number"
            value={transacaoSelecionada?.valor || ""}
            onChange={(e) => setTransacaoSelecionada({ ...transacaoSelecionada!, valor: Number(e.target.value) })}
          />
          <Input
            placeholder="Produto ID"
            type="number"
            value={transacaoSelecionada?.produtoId || ""}
            onChange={(e) => setTransacaoSelecionada({ ...transacaoSelecionada!, produtoId: Number(e.target.value) })}
          />
          <Input
            placeholder="Pedido ID"
            type="number"
            value={transacaoSelecionada?.pedidoId || ""}
            onChange={(e) => setTransacaoSelecionada({ ...transacaoSelecionada!, pedidoId: Number(e.target.value) })}
          />
          <Button onClick={handleSalvarTransacao}>Salvar</Button>
        </Modal>
      )}
    </div>
  );
};

export default GerenciamentoTransacoes;

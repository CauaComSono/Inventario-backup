import { useState, useEffect } from 'react';
import ItemPedidoService, { ItemPedido as ItemPedidoType } from '@/service/itemPedidoService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import Table from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface ItemPedidoWithTotal extends ItemPedidoType {
  total: number;
}

import "./itemPedido.css"
import "./modal.css"

export default function ItemPedidoManager() {
  const [itensPedido, setItensPedido] = useState<ItemPedidoWithTotal[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemPedidoWithTotal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterPedidoId, setFilterPedidoId] = useState('');

  const [formData, setFormData] = useState<Omit<ItemPedidoType, 'id'>>({
    pedidoId: 0,
    produtoId: 0,
    quantidade: 0,
    precoUnitario: 0,
  });

  const loadItensPedido = async () => {
    try {
      setIsLoading(true);
      const items = await ItemPedidoService.listItensPedido();
      const itemsWithTotal = items.map(item => ({
        ...item,
        total: calculateTotal(item.quantidade, item.precoUnitario)
      }));
      setItensPedido(itemsWithTotal);
    } catch (error) {
      alert('Não foi possível carregar os itens do pedido.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItensPedido();
  }, []);

  const filteredItens = filterPedidoId
    ? itensPedido.filter(item => item.pedidoId.toString() === filterPedidoId)
    : itensPedido;

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({
      pedidoId: 0,
      produtoId: 0,
      quantidade: 0,
      precoUnitario: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ItemPedidoWithTotal) => {
    setIsEditing(true);
    setSelectedItem(item);
    setFormData({
      pedidoId: item.pedidoId,
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await ItemPedidoService.deleteItemPedido(id);
        setItensPedido(itensPedido.filter(item => item.id !== id));
        alert('Item excluído com sucesso.');
      } catch (error) {
        alert('Não foi possível excluir o item.');
      }
    }
  };

  const calculateTotal = (quantidade: number, precoUnitario: number) => {
    return quantidade * precoUnitario;
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && selectedItem) {
        const updatedItem = await ItemPedidoService.updateItemPedido({
          id: selectedItem.id,
          ...formData
        });
        
        setItensPedido(itensPedido.map(item =>
          item.id === selectedItem.id 
            ? { ...updatedItem, total: calculateTotal(updatedItem.quantidade, updatedItem.precoUnitario) }
            : item
        ));

        alert('Item atualizado com sucesso.');
      } else {
        const newItem = await ItemPedidoService.addItemPedido(formData);
        setItensPedido([...itensPedido, {
          ...newItem,
          total: calculateTotal(newItem.quantidade, newItem.precoUnitario)
        }]);

        alert('Item criado com sucesso.');
      }
      setIsDialogOpen(false);
    } catch (error) {
      alert(isEditing 
        ? 'Não foi possível atualizar o item.'
        : 'Não foi possível criar o item.'
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Gestão de Itens do Pedido</span>
            <Button onClick={handleCreate}>Novo Item</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="number"
              placeholder="Filtrar por ID do Pedido..."
              value={filterPedidoId}
              onChange={(e) => setFilterPedidoId(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table 
            head={
              <>
                <th>ID</th>
                <th>Pedido ID</th>
                <th>Produto ID</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
                <th>Ações</th>
              </>
            }
          >
            {isLoading ? (
              <tr>
                <td>Carregando...</td>
              </tr>
            ) : filteredItens.length === 0 ? (
              <tr>
                <td>Nenhum item encontrado</td>
              </tr>
            ) : (
              filteredItens.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.pedidoId}</td>
                  <td>{item.produtoId}</td>
                  <td>{item.quantidade}</td>
                  <td>R$ {item.precoUnitario.toFixed(2)}</td>
                  <td>R$ {item.total.toFixed(2)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleEdit(item)}>
                        Editar
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Item' : 'Novo Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pedido ID</label>
              <Input
                type="number"
                value={formData.pedidoId}
                onChange={(e) => setFormData({ ...formData, pedidoId: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Produto ID</label>
              <Input
                type="number"
                value={formData.produtoId}
                onChange={(e) => setFormData({ ...formData, produtoId: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantidade</label>
              <Input
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preço Unitário</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.precoUnitario}
                onChange={(e) => setFormData({ ...formData, precoUnitario: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Calculado</label>
              <Input
                type="text"
                value={`R$ ${calculateTotal(formData.quantidade, formData.precoUnitario).toFixed(2)}`}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {isEditing ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
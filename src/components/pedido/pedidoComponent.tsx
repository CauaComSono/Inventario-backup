import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import Table from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PedidoService, { Pedido } from '@/service/pedidoService';

export default function PedidosManager() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [dataFilter, setDataFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'data' | 'total'>('data');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Form state
  const [formData, setFormData] = useState<Omit<Pedido, 'id'>>({
    data: '',
    clienteId: 0,
    status: 'Pendente',
    total: 0,
  });

  const statusOptions = ['Pendente', 'Em Processamento', 'Concluído', 'Cancelado'];

  const loadPedidos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await PedidoService.listPedidos();
      setPedidos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  useEffect(() => {
    let filtered = [...pedidos];

    if (dataFilter) {
      filtered = filtered.filter(p => p.data.includes(dataFilter));
    }
    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const compareValue = sortBy === 'data' 
        ? new Date(a.data).getTime() - new Date(b.data).getTime()
        : a.total - b.total;
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    setFilteredPedidos(filtered);
  }, [pedidos, dataFilter, statusFilter, sortBy, sortOrder]);

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({
      data: new Date().toISOString().split('T')[0],
      clienteId: 0,
      status: 'Pendente',
      total: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (pedido: Pedido) => {
    setIsEditing(true);
    setSelectedPedido(pedido);
    setFormData({
      data: pedido.data,
      clienteId: pedido.clienteId,
      status: pedido.status,
      total: pedido.total,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        setIsLoading(true);
        setError(null);
        await PedidoService.deletePedido(id);
        await loadPedidos();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao excluir pedido');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (isEditing && selectedPedido) {
        await PedidoService.updatePedido({
          ...formData,
          id: selectedPedido.id
        });
      } else {
        await PedidoService.addPedido(formData);
      }
      
      await loadPedidos();
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Gestão de Pedidos</span>
            <Button onClick={handleCreate} disabled={isLoading}>Novo Pedido</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <Input
              type="date"
              placeholder="Filtrar por data"
              value={dataFilter}
              onChange={(e) => setDataFilter(e.target.value)}
              className="w-48"
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-48"
            >
              <option value="">Todos os status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as 'data' | 'total')}
              className="w-48"
            >
              <option value="data">Ordenar por Data</option>
              <option value="total">Ordenar por Valor</option>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>

          <Table 
            head={
              <>
                <th>ID</th>
                <th>Data</th>
                <th>Cliente ID</th>
                <th>Status</th>
                <th>Total</th>
                <th>Ações</th>
              </>
            }
          >
            {filteredPedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{new Date(pedido.data).toLocaleDateString()}</td>
                <td>{pedido.clienteId}</td>
                <td>{pedido.status}</td>
                <td>R$ {pedido.total.toFixed(2)}</td>
                <td>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleEdit(pedido)}
                      disabled={isLoading}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDelete(pedido.id)}
                      disabled={isLoading}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for Create/Edit remains the same */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Pedido' : 'Novo Pedido'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cliente ID</label>
              <Input
                type="number"
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: Number(e.target.value) })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={isLoading}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total</label>
              <Input
                type="number"
                step="0.01"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: Number(e.target.value) })}
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isEditing ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
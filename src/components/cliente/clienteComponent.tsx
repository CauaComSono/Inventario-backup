import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import Table from '@/components/ui/table';
import { DialogContent, Dialog, DialogHeader, DialogTitle } from '../ui/dialog';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export default function ClienteManager() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Omit<Cliente, 'id'>>({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
  });

  useEffect(() => {
    const mockClientes: Cliente[] = [
      { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 99999-9999', endereco: 'Rua A, 123' },
      { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 88888-8888', endereco: 'Rua B, 456' },
    ];
    setClientes(mockClientes);
  }, []);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setIsEditing(true);
    setSelectedCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  const handleSubmit = () => {
    if (isEditing && selectedCliente) {
      setClientes(clientes.map(c =>
        c.id === selectedCliente.id ? { ...formData, id: selectedCliente.id } : c
      ));
    } else {
      const newCliente = {
        ...formData,
        id: Math.max(...clientes.map(c => c.id)) + 1,
      };
      setClientes([...clientes, newCliente]);
    }
    setIsDialogOpen(false);
  };

  // Custom table head for the new Table component
  const tableHead = (
    <>
      <th className="px-4 py-2 text-left">ID</th>
      <th className="px-4 py-2 text-left">Nome</th>
      <th className="px-4 py-2 text-left">Email</th>
      <th className="px-4 py-2 text-left">Telefone</th>
      <th className="px-4 py-2 text-left">Endereço</th>
      <th className="px-4 py-2 text-left">Ações</th>
    </>
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Gestão de Clientes</span>
            <Button onClick={handleCreate}>Novo Cliente</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table head={tableHead}>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="border-b">
                <td className="px-4 py-2">{cliente.id}</td>
                <td className="px-4 py-2">{cliente.nome}</td>
                <td className="px-4 py-2">{cliente.email}</td>
                <td className="px-4 py-2">{cliente.telefone}</td>
                <td className="px-4 py-2">{cliente.endereco}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleEdit(cliente)}>
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(cliente.id)}>
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <Input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Endereço</label>
              <Input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
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
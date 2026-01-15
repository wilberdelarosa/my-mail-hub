import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Client } from '@/types/database';

export function ClientsList() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Client[];
    },
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente eliminado');
    },
  });

  const filtered = clients?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.rnc?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gestiona tu cartera de clientes</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o RNC..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered?.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    {client.rnc && <p className="text-sm text-muted-foreground">RNC: {client.rnc}</p>}
                  </div>
                </div>
                <Badge variant={client.is_active ? "default" : "secondary"}>
                  {client.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {client.contact_email && <p className="text-sm">{client.contact_email}</p>}
              {client.contact_phone && <p className="text-sm text-muted-foreground">{client.contact_phone}</p>}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm"><Edit className="h-3 w-3 mr-1" /> Editar</Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => deleteClient.mutate(client.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && filtered?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay clientes registrados</p>
        </div>
      )}
    </div>
  );
}

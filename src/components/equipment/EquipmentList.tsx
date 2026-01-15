import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Plus, Search, Package } from 'lucide-react';
import { Equipment, UNIT_TYPE_LABELS } from '@/types/database';

export function EquipmentList() {
  const [search, setSearch] = useState('');

  const { data: equipment } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const { data, error } = await supabase.from('equipment').select('*').order('name');
      if (error) throw error;
      return data as Equipment[];
    },
  });

  const filtered = equipment?.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.code?.includes(search)
  );

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Equipos</h1>
          <p className="text-muted-foreground">Catálogo de equipos y servicios</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Equipo
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar equipo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered?.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  {item.code && <p className="text-sm text-muted-foreground">Código: {item.code}</p>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{UNIT_TYPE_LABELS[item.default_unit]}</span>
                <span className="font-semibold">{formatCurrency(item.default_price)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay equipos registrados</p>
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Inbox, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QueueRequest {
  id: string;
  source: 'MANUAL' | 'WHATSAPP' | 'WEB' | 'AI' | string;
  status: 'RECEIVED' | 'PROCESSED' | 'FAILED' | 'PENDING' | string;
  payload: Record<string, any> | null;
  document_id: string | null;
  created_at: string;
  processed_at: string | null;
  error: string | null;
}

const statusStyles: Record<string, string> = {
  RECEIVED: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-amber-100 text-amber-700',
  PROCESSED: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-700',
};

const sourceStyles: Record<string, string> = {
  MANUAL: 'bg-slate-100 text-slate-700',
  WHATSAPP: 'bg-green-100 text-green-700',
  WEB: 'bg-indigo-100 text-indigo-700',
  AI: 'bg-purple-100 text-purple-700',
};

export function QueueRequestsList() {
  const [search, setSearch] = useState('');

  const client = supabase as any;

  const { data, isLoading } = useQuery({
    queryKey: ['queue-requests'],
    queryFn: async () => {
      const { data, error } = await client
        .from('queue_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as QueueRequest[];
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((item) => {
      const payloadText = JSON.stringify(item.payload || {}).toLowerCase();
      return (
        item.id.toLowerCase().includes(term) ||
        item.source.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term) ||
        payloadText.includes(term)
      );
    });
  }, [data, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Solicitudes por cola</h1>
          <p className="text-muted-foreground">
            Monitor de ingestas (n8n → RabbitMQ → aplicación)
          </p>
        </div>
        <Badge className="bg-amber-500 text-white">RabbitMQ</Badge>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ID, estado o contenido..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-base">Cola de solicitudes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Procesado</TableHead>
                <TableHead>Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Cargando solicitudes...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-8 w-8 opacity-40" />
                      No hay solicitudes en cola.
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.id}</TableCell>
                  <TableCell>
                    <Badge className={cn('capitalize', sourceStyles[item.source] || 'bg-slate-100 text-slate-700')}>
                      {item.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(statusStyles[item.status] || 'bg-slate-100 text-slate-700')}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {item.document_id ? item.document_id : '—'}
                  </TableCell>
                  <TableCell className="text-xs">
                    {new Date(item.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs">
                    {item.processed_at ? new Date(item.processed_at).toLocaleString() : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[240px] truncate">
                    {item.error ? `Error: ${item.error}` : JSON.stringify(item.payload || {})}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS, DocumentType, DocumentStatus } from '@/types/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function DocumentsList() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*, clients(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = documents?.filter(d => 
    d.document_number.toLowerCase().includes(search.toLowerCase()) ||
    d.clients?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      borrador: 'bg-gray-100 text-gray-700',
      enviado: 'bg-blue-100 text-blue-700',
      aprobado: 'bg-green-100 text-green-700',
      pagado: 'bg-emerald-100 text-emerald-700',
      rechazado: 'bg-red-100 text-red-700',
      cancelado: 'bg-gray-100 text-gray-500',
    };
    return colors[status] || colors.borrador;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Documentos</h1>
          <p className="text-muted-foreground">Cotizaciones, proformas y facturas</p>
        </div>
        <Button onClick={() => navigate('/documentos/nuevo')} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Documento
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar documento..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-3">
        {filtered?.map((doc: any) => (
          <Card key={doc.id} className="hover:shadow-md cursor-pointer transition-shadow" onClick={() => navigate(`/documentos/${doc.id}`)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.document_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.clients?.name || 'Sin cliente'} • {DOCUMENT_TYPE_LABELS[doc.document_type as DocumentType]}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(doc.total || 0)}</p>
                  <Badge className={getStatusColor(doc.status)}>
                    {DOCUMENT_STATUS_LABELS[doc.status as DocumentStatus]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay documentos</p>
        </div>
      )}
    </div>
  );
}

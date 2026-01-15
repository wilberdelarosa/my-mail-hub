import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  Package,
  DollarSign,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { DOCUMENT_STATUS_LABELS, DOCUMENT_TYPE_LABELS, DocumentStatus, DocumentType } from '@/types/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function DashboardHome() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [documentsRes, clientsRes, equipmentRes] = await Promise.all([
        supabase.from('documents').select('id, total, status, document_type'),
        supabase.from('clients').select('id').eq('is_active', true),
        supabase.from('equipment').select('id').eq('is_active', true),
      ]);

      const documents = documentsRes.data || [];
      const totalFacturado = documents
        .filter((d) => d.status === 'pagado')
        .reduce((sum, d) => sum + (d.total || 0), 0);

      return {
        totalDocuments: documents.length,
        totalClients: clientsRes.data?.length || 0,
        totalEquipment: equipmentRes.data?.length || 0,
        totalFacturado,
        pendientes: documents.filter((d) => d.status === 'enviado').length,
        borradores: documents.filter((d) => d.status === 'borrador').length,
      };
    },
  });

  const { data: recentDocuments } = useQuery({
    queryKey: ['recent-documents'],
    queryFn: async () => {
      const { data } = await supabase
        .from('documents')
        .select('*, clients(name)')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'borrador':
        return 'bg-gray-100 text-gray-700';
      case 'enviado':
        return 'bg-blue-100 text-blue-700';
      case 'aprobado':
        return 'bg-green-100 text-green-700';
      case 'pagado':
        return 'bg-emerald-100 text-emerald-700';
      case 'rechazado':
        return 'bg-red-100 text-red-700';
      case 'cancelado':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de tu sistema de facturación</p>
        </div>
        <Button onClick={() => navigate('/documentos/nuevo')} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Documento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(stats?.totalFacturado || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Documentos pagados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDocuments || 0}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {stats?.pendientes || 0} pendientes
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Clientes activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Equipos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEquipment || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En catálogo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documentos Recientes</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/documentos')}>
            Ver todos
          </Button>
        </CardHeader>
        <CardContent>
          {recentDocuments && recentDocuments.length > 0 ? (
            <div className="space-y-4">
              {recentDocuments.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => navigate(`/documentos/${doc.id}`)}
                >
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay documentos aún</p>
              <Button variant="link" onClick={() => navigate('/documentos/nuevo')}>
                Crear tu primer documento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/documentos/nuevo?type=cotizacion')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold">Nueva Cotización</h3>
                <p className="text-sm text-muted-foreground">Crear presupuesto para cliente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/documentos/nuevo?type=proforma')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Nueva Proforma</h3>
                <p className="text-sm text-muted-foreground">Generar proforma de servicio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/documentos/nuevo?type=factura')}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Nueva Factura</h3>
                <p className="text-sm text-muted-foreground">Emitir factura fiscal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

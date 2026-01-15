import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Ajustes de la empresa y sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Datos de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Configuración próximamente disponible.</p>
        </CardContent>
      </Card>
    </div>
  );
}

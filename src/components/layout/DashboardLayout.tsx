import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Truck,
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Documentos', path: '/documentos' },
  { icon: Users, label: 'Clientes', path: '/clientes' },
  { icon: Package, label: 'Equipos', path: '/equipos' },
  { icon: Sparkles, label: 'Asistente IA', path: '/asistente' },
  { icon: Settings, label: 'Configuración', path: '/configuracion' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-lg">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-sm">ALITO GROUP</span>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-background border-r transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-2 rounded-xl flex-shrink-0">
                <Truck className="h-6 w-6 text-white" />
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <h1 className="font-bold text-sm">ALITO GROUP</h1>
                  <p className="text-xs text-muted-foreground">Facturación</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronDown className={cn("h-4 w-4 transition-transform", sidebarOpen ? "rotate-90" : "-rotate-90")} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  !sidebarOpen && "justify-center px-2"
                )}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t space-y-2">
            {sidebarOpen && (
              <div className="px-3 py-2">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
            )}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
                !sidebarOpen && "justify-center px-2"
              )}
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Cerrar Sesión</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 pt-14 lg:pt-0",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    FileText,
    Receipt,
    Banknote,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';

const MENU_ITEMS = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', href: '/dashboard/customers', icon: Users },
    { name: 'Cotizaciones', href: '/dashboard/quotes', icon: FileText },
    { name: 'Facturas', href: '/dashboard/invoices', icon: Receipt },
    { name: 'Cobros', href: '/dashboard/ar', icon: Banknote },
    // { name: 'Reportes', href: '/dashboard/reports', icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-900 text-white">
            <div className="flex h-16 items-center px-6">
                <span className="text-xl font-bold tracking-tight">Alito Group</span>
            </div>

            <div className="flex flex-1 flex-col justify-between px-3 py-4">
                <nav className="space-y-1">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-800",
                                    isActive ? "bg-slate-800 text-white" : "text-slate-400"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="space-y-1 border-t border-slate-800 pt-3">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800"
                    >
                        <Settings className="h-5 w-5" />
                        Configuración
                    </Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800"
                    >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

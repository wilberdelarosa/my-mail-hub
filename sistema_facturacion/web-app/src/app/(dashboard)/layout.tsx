'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import {
    LayoutDashboard,
    Users,
    FileText,
    Receipt,
    CreditCard,
    Settings,
    LogOut,
    Bell,
    Package,
    ClipboardCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/customers', label: 'Clientes', icon: Users },
    { href: '/quotes', label: 'Cotizaciones', icon: FileText },
    { href: '/proformas', label: 'Proformas', icon: ClipboardCheck },
    { href: '/invoices', label: 'Facturas', icon: Receipt },
    { href: '/payments', label: 'Cobros', icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.clear();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="flex">
                {/* Sidebar */}
                <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white/80 backdrop-blur-xl">
                    <div className="flex h-16 items-center border-b border-slate-200 px-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">A</span>
                            </div>
                            <span className="font-bold text-slate-900 tracking-tight text-lg">ALITO GROUP</span>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between h-[calc(100vh-64px)] p-4">
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${isActive
                                            ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="space-y-1 pb-4">
                            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
                                <Settings className="h-5 w-5 text-slate-400" />
                                Configuración
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                            >
                                <LogOut className="h-5 w-5" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 pl-64">
                    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <h2 className="text-sm font-medium text-slate-500 capitalize">
                                {pathname.replace('/', '') || 'Dashboard'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            </button>
                            <div className="h-8 w-px bg-slate-200" />
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-900">Administrador</p>
                                    <p className="text-xs text-slate-500">admin@alitogroup.com</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    <User className="h-6 w-6 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="p-8 max-w-7xl mx-auto">{children}</main>
                </div>
            </div>
        </div>
    );
}

function User({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

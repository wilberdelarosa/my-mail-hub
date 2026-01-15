import { Outlet, Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    FileText,
    Receipt,
    DollarSign,
    FileSpreadsheet,
    BarChart3,
    LogOut
} from 'lucide-react'

export default function DashboardLayout() {
    const location = useLocation()

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/customers', icon: Users, label: 'Clientes' },
        { path: '/quotes', icon: FileText, label: 'Cotizaciones' },
        { path: '/proformas', icon: FileSpreadsheet, label: 'Proformas' },
        { path: '/invoices', icon: Receipt, label: 'Facturas' },
        { path: '/payments', icon: DollarSign, label: 'Cobros' },
        { path: '/templates', icon: FileText, label: 'Templates' },
        { path: '/reports', icon: BarChart3, label: 'Reportes' },
    ]

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">ALITO GROUP</h1>
                    <p className="text-sm text-blue-200 mt-1">Sistema de Facturación</p>
                </div>

                <nav className="mt-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-6 py-3 transition ${isActive
                                        ? 'bg-blue-700 border-r-4 border-white'
                                        : 'hover:bg-blue-800'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-0 w-64 p-6">
                    <button className="flex items-center gap-3 text-blue-200 hover:text-white transition w-full">
                        <LogOut className="w-5 h-5" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}

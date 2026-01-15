import { Routes, Route, Navigate } from 'react-router-dom'

// Pages
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './pages/Dashboard'
import CustomersPage from './pages/Customers'
import QuotesPage from './pages/Quotes'
import ProformasPage from './pages/Proformas'
import InvoicesPage from './pages/Invoices'
import PaymentsPage from './pages/Payments'
import PaymentsNewPage from './pages/PaymentsNew'
import TemplatesPage from './pages/Templates'
import ReportsPage from './pages/Reports'

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="quotes" element={<QuotesPage />} />
                <Route path="proformas" element={<ProformasPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="payments/new" element={<PaymentsNewPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="reports" element={<ReportsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default App

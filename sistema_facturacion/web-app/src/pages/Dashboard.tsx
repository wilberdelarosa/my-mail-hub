export default function Dashboard() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <p className="text-sm text-gray-600">Clientes</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">156</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <p className="text-sm text-gray-600">Cotizaciones</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">42</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <p className="text-sm text-gray-600">Facturas</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">28</p>
                </div>
            </div>
        </div>
    )
}

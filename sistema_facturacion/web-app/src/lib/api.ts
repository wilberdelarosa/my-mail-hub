import axios from 'axios';

// Base URLs para cada microservicio.
// En produccion, definir NEXT_PUBLIC_*_URL para apuntar a Kong o a cada servicio.
const SERVICES = {
    identity: process.env.NEXT_PUBLIC_IDENTITY_URL || 'http://localhost:3001/api/identity/v1',
    masterData: process.env.NEXT_PUBLIC_MASTER_DATA_URL || 'http://localhost:3002/api/master-data/v1',
    quotation: process.env.NEXT_PUBLIC_QUOTATION_URL || 'http://localhost:3003/api/quotation/v1',
    billing: process.env.NEXT_PUBLIC_BILLING_URL || 'http://localhost:3004/api/billing/v1',
    ar: process.env.NEXT_PUBLIC_AR_URL || 'http://localhost:3005/api/ar/v1',
};

// Crear instancias pre-configuradas
export const identityApi = axios.create({ baseURL: SERVICES.identity });
export const masterDataApi = axios.create({ baseURL: SERVICES.masterData });
export const quotationApi = axios.create({ baseURL: SERVICES.quotation });
export const proformaApi = axios.create({ baseURL: SERVICES.quotation }); // Proformas viven en Quotation Service por ahora
export const billingApi = axios.create({ baseURL: SERVICES.billing });
export const arApi = axios.create({ baseURL: SERVICES.ar });

// Interceptor para token JWT
const addTokenInterceptor = (instance: any) => {
    instance.interceptors.request.use((config: any) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

// Aplicar interceptor a todos
[identityApi, masterDataApi, quotationApi, proformaApi, billingApi, arApi].forEach(addTokenInterceptor);

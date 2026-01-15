import { Notification } from "@/types/notification";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    from: "Juan García",
    fromEmail: "juan.garcia@empresa.com",
    subject: "Reunión de proyecto mañana",
    preview: "Hola, te escribo para confirmar la reunión de mañana a las 10:00...",
    content: "Hola,\n\nTe escribo para confirmar la reunión de mañana a las 10:00 AM en la sala de conferencias principal.\n\nTemas a tratar:\n- Avance del proyecto\n- Nuevos requerimientos\n- Planificación del próximo sprint\n\nSaludos,\nJuan",
    date: new Date(2026, 0, 15, 9, 30),
    read: false,
    starred: true,
    category: "primary"
  },
  {
    id: "2",
    from: "Sistema ALITO",
    fromEmail: "sistema@alitogroup.com",
    subject: "Nueva factura generada #FAC-2026-0042",
    preview: "Se ha generado correctamente la factura #FAC-2026-0042 por un monto de...",
    content: "Estimado usuario,\n\nSe ha generado correctamente la factura #FAC-2026-0042 por un monto de $15,420.00.\n\nPuede descargar el documento desde el sistema.\n\nAtentamente,\nSistema de Facturación ALITO",
    date: new Date(2026, 0, 15, 8, 15),
    read: false,
    starred: false,
    category: "updates",
    attachments: ["FAC-2026-0042.pdf"]
  },
  {
    id: "3",
    from: "LinkedIn",
    fromEmail: "notifications@linkedin.com",
    subject: "María López vio tu perfil",
    preview: "María López, Gerente de TI en Tech Solutions, visitó tu perfil...",
    content: "María López, Gerente de TI en Tech Solutions, visitó tu perfil.\n\nMira quién más ha visto tu perfil esta semana.",
    date: new Date(2026, 0, 14, 18, 45),
    read: true,
    starred: false,
    category: "social"
  },
  {
    id: "4",
    from: "Amazon",
    fromEmail: "shipment-tracking@amazon.com",
    subject: "Tu pedido ha sido enviado",
    preview: "Tu pedido #123-4567890 está en camino y llegará el viernes...",
    content: "Tu pedido #123-4567890 está en camino.\n\nFecha estimada de entrega: Viernes, 17 de enero\n\nRastrear pedido: https://amazon.com/tracking/123-4567890",
    date: new Date(2026, 0, 14, 14, 20),
    read: true,
    starred: true,
    category: "promotions"
  },
  {
    id: "5",
    from: "Carlos Mendez",
    fromEmail: "carlos.mendez@cliente.com",
    subject: "RE: Cotización solicitada",
    preview: "Gracias por enviar la cotización. Tenemos algunas preguntas sobre...",
    content: "Hola,\n\nGracias por enviar la cotización. Tenemos algunas preguntas sobre los términos de pago y los tiempos de entrega.\n\n¿Podríamos agendar una llamada para discutirlo?\n\nSaludos,\nCarlos",
    date: new Date(2026, 0, 14, 11, 0),
    read: false,
    starred: false,
    category: "primary"
  },
  {
    id: "6",
    from: "GitHub",
    fromEmail: "noreply@github.com",
    subject: "[alito-group/facturacion] Pull request merged",
    preview: "Pull request #45 'Feature: Nuevo módulo de reportes' has been merged...",
    content: "Pull request #45 'Feature: Nuevo módulo de reportes' has been merged into main by @developer.\n\nView on GitHub: https://github.com/alito-group/facturacion/pull/45",
    date: new Date(2026, 0, 13, 16, 30),
    read: true,
    starred: false,
    category: "updates"
  },
  {
    id: "7",
    from: "Banco Nacional",
    fromEmail: "notificaciones@banconacional.com",
    subject: "Confirmación de transferencia",
    preview: "Se ha realizado una transferencia exitosa desde tu cuenta...",
    content: "Estimado cliente,\n\nSe ha realizado una transferencia exitosa desde tu cuenta.\n\nMonto: $5,000.00\nDestino: Proveedor XYZ\nReferencia: TRF-2026-00123\n\nSi no reconoces esta operación, contáctanos inmediatamente.",
    date: new Date(2026, 0, 13, 10, 15),
    read: true,
    starred: true,
    category: "primary"
  },
  {
    id: "8",
    from: "Newsletter Tech",
    fromEmail: "newsletter@techdigest.com",
    subject: "Las 10 tendencias tech para 2026",
    preview: "Descubre las tecnologías que dominarán este año: IA generativa...",
    content: "Las 10 tendencias tecnológicas que dominarán 2026:\n\n1. IA Generativa avanzada\n2. Computación cuántica práctica\n3. Web3 y descentralización\n4. Realidad mixta\n5. Edge computing\n...",
    date: new Date(2026, 0, 12, 9, 0),
    read: true,
    starred: false,
    category: "promotions"
  }
];

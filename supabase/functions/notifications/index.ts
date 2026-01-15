import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const N8N_WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Notification types
type NotificationType = 
  | "quote_created"
  | "quote_approved"
  | "quote_rejected"
  | "quote_expired"
  | "proforma_updated"
  | "invoice_issued"
  | "invoice_overdue"
  | "payment_received"
  | "payment_reminder"
  | "notification_failed";

interface NotificationPayload {
  type: NotificationType;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientTelegramChatId?: number;
  documentId?: string;
  documentNumber?: string;
  clientName?: string;
  amount?: number;
  customMessage?: string;
  dueDate?: string;
  daysOverdue?: number;
}

// Event types that trigger notifications
type DomainEvent = 
  | "QuoteApproved"
  | "QuoteRejected"
  | "QuoteExpired"
  | "InvoiceIssued"
  | "InvoiceOverdue"
  | "PaymentApplied";

// Email templates with Resend
const emailTemplates: Record<NotificationType, { subject: string; body: (data: any) => string }> = {
  quote_created: {
    subject: "Nueva Cotización #{documentNumber} - ALITO GROUP SRL",
    body: (d) => `
      <!DOCTYPE html>
      <html>
      <head><style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .amount { font-size: 24px; color: #1a365d; font-weight: bold; }
        .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; }
        .btn { background: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
      </style></head>
      <body>
        <div class="header"><h1>ALITO GROUP SRL</h1></div>
        <div class="content">
          <h2>Nueva Cotización Generada</h2>
          <p>Estimado/a <strong>${d.clientName}</strong>,</p>
          <p>Se ha generado la cotización <strong>#${d.documentNumber}</strong>.</p>
          <p class="amount">Monto Total: RD$${d.amount?.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</p>
          <p>Por favor revise los detalles y confirme su aprobación.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="#" class="btn">Ver Cotización</a>
          </p>
        </div>
        <div class="footer">
          <p>ALITO GROUP SRL | RNC: 1-32-00000-0</p>
          <p>Tel: 809-555-1234 | info@alitogroup.com</p>
        </div>
      </body>
      </html>
    `,
  },
  quote_approved: {
    subject: "Cotización #{documentNumber} Aprobada - ALITO GROUP SRL",
    body: (d) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #22c55e;">✅ Cotización Aprobada</h2>
        <p>La cotización <strong>#${d.documentNumber}</strong> ha sido aprobada.</p>
        <p>Procederemos a coordinar los servicios acordados.</p>
        <p>Atentamente,<br/>ALITO GROUP SRL</p>
      </body>
      </html>
    `,
  },
  quote_rejected: {
    subject: "Cotización #{documentNumber} - Estado Actualizado",
    body: (d) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #ef4444;">Cotización No Aprobada</h2>
        <p>Lamentamos informar que la cotización <strong>#${d.documentNumber}</strong> no fue aprobada.</p>
        <p>Si desea discutir alternativas, no dude en contactarnos.</p>
        <p>Atentamente,<br/>ALITO GROUP SRL</p>
      </body>
      </html>
    `,
  },
  quote_expired: {
    subject: "Cotización #{documentNumber} Expirada - ALITO GROUP SRL",
    body: (d) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #f59e0b;">⏰ Cotización Expirada</h2>
        <p>La cotización <strong>#${d.documentNumber}</strong> ha expirado.</p>
        <p>Si aún necesita nuestros servicios, solicite una nueva cotización con precios actualizados.</p>
        <p>Atentamente,<br/>ALITO GROUP SRL</p>
      </body>
      </html>
    `,
  },
  proforma_updated: {
    subject: "Actualización Proforma - ALITO GROUP SRL",
    body: (d) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>📋 Proforma Actualizada</h2>
        <p>Se han registrado nuevas entregas en su proforma.</p>
        <p>${d.customMessage || ""}</p>
        <p>Atentamente,<br/>ALITO GROUP SRL</p>
      </body>
      </html>
    `,
  },
  invoice_issued: {
    subject: "Factura #{documentNumber} Emitida - ALITO GROUP SRL",
    body: (d) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #1a365d;">🧾 Factura Fiscal Emitida</h2>
        <p>Estimado/a ${d.clientName},</p>
        <p>Se ha emitido la factura <strong>#${d.documentNumber}</strong>.</p>
        <p style="font-size: 20px; color: #1a365d;"><strong>Monto: RD$${d.amount?.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong></p>
        <p>Por favor proceda con el pago según los términos acordados.</p>
        <p>Atentamente,<br/>ALITO GROUP SRL</p>
      </body>
      </html>
    `,
  },
  invoice_overdue: {
    subject: "⚠️ Factura Vencida #{documentNumber} - ALITO GROUP SRL",
    body: (d) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #dc2626;">⚠️ Factura Vencida</h2>
        <p>Estimado/a ${d.clientName},</p>
        <p>La factura <strong>#${d.documentNumber}</strong> está vencida hace <strong>${d.daysOverdue} días</strong>.</p>
        <p style="font-size: 20px; color: #dc2626;"><strong>Saldo Pendiente: RD$${d.amount?.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong></p>
        <p>Por favor regularice su situación a la brevedad posible.</p>
        <p>Atentamente,<br/>ALITO GROUP SRL</p>
      </body>
      </html>
    `,
  },
  payment_received: {
    subject: "Pago Recibido - ALITO GROUP SRL",
    body: (d) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #22c55e;">💰 Confirmación de Pago</h2>
        <p>Hemos recibido su pago por <strong>RD$${d.amount?.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>.</p>
        <p>Gracias por su confianza.</p>
        <p>Atentamente,<br/>ALITO GROUP SRL</p>
      </body>
      </html>
    `,
  },
  payment_reminder: {
    subject: "Recordatorio de Pago - ALITO GROUP SRL",
    body: (d) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #f59e0b;">📅 Recordatorio de Pago</h2>
        <p>Estimado/a ${d.clientName},</p>
        <p>Le recordamos que tiene un saldo pendiente de <strong>RD$${d.amount?.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>.</p>
        ${d.dueDate ? `<p>Fecha de vencimiento: ${d.dueDate}</p>` : ""}
        <p>Por favor proceda con el pago a la brevedad posible.</p>
        <p>Atentamente,<br/>ALITO GROUP SRL</p>
      </body>
      </html>
    `,
  },
  notification_failed: {
    subject: "Error de Notificación - Sistema ALITO GROUP",
    body: (d) => `Error interno: ${d.customMessage}`,
  },
};

// Telegram message templates
const telegramTemplates: Record<NotificationType, (data: any) => string> = {
  quote_created: (d) => `📄 <b>Nueva Cotización</b>\n\n#${d.documentNumber}\nCliente: ${d.clientName}\nMonto: RD$${d.amount?.toLocaleString("es-DO")}`,
  quote_approved: (d) => `✅ <b>Cotización Aprobada</b>\n\n#${d.documentNumber} ha sido aprobada.`,
  quote_rejected: (d) => `❌ <b>Cotización Rechazada</b>\n\n#${d.documentNumber} no fue aprobada.`,
  quote_expired: (d) => `⏰ <b>Cotización Expirada</b>\n\n#${d.documentNumber} ha expirado.`,
  proforma_updated: (d) => `📋 <b>Proforma Actualizada</b>\n\n${d.customMessage || "Se registraron nuevas entregas."}`,
  invoice_issued: (d) => `🧾 <b>Factura Emitida</b>\n\n#${d.documentNumber}\nMonto: RD$${d.amount?.toLocaleString("es-DO")}`,
  invoice_overdue: (d) => `⚠️ <b>Factura Vencida</b>\n\n#${d.documentNumber}\nVencida hace ${d.daysOverdue} días\nSaldo: RD$${d.amount?.toLocaleString("es-DO")}`,
  payment_received: (d) => `💰 <b>Pago Recibido</b>\n\nRD$${d.amount?.toLocaleString("es-DO")}`,
  payment_reminder: (d) => `📅 <b>Recordatorio de Pago</b>\n\nSaldo pendiente: RD$${d.amount?.toLocaleString("es-DO")}`,
  notification_failed: (d) => `❌ Error: ${d.customMessage}`,
};

// Send Telegram notification
async function sendTelegram(chatId: number, message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log("Telegram not configured");
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const result = await response.json();
    return result.ok === true;
  } catch (error) {
    console.error("Telegram send error:", error);
    return false;
  }
}

// Send Email via Resend
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log("Email (Resend) not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ALITO GROUP <notificaciones@alitogroup.com>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

// Send to n8n webhook
async function sendToN8N(payload: NotificationPayload): Promise<boolean> {
  if (!N8N_WEBHOOK_URL) {
    console.log("n8n not configured");
    return false;
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: payload.type,
        data: payload,
        timestamp: new Date().toISOString(),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("n8n send error:", error);
    return false;
  }
}

// Log notification to database
async function logNotification(
  payload: NotificationPayload, 
  channel: string, 
  success: boolean, 
  error?: string
) {
  console.log(`Notification [${channel}] ${payload.type}: ${success ? "SUCCESS" : "FAILED"}`, error || "");
  
  // Could store in a notifications_log table
  // await supabase.from("notification_logs").insert({...})
}

// Process domain events
async function processDomainEvent(event: DomainEvent, data: any): Promise<void> {
  console.log(`Processing domain event: ${event}`, data);

  let notificationType: NotificationType;
  
  switch (event) {
    case "QuoteApproved":
      notificationType = "quote_approved";
      break;
    case "QuoteRejected":
      notificationType = "quote_rejected";
      break;
    case "QuoteExpired":
      notificationType = "quote_expired";
      break;
    case "InvoiceIssued":
      notificationType = "invoice_issued";
      break;
    case "InvoiceOverdue":
      notificationType = "invoice_overdue";
      break;
    case "PaymentApplied":
      notificationType = "payment_received";
      break;
    default:
      console.log(`Unknown event: ${event}`);
      return;
  }

  const payload: NotificationPayload = {
    type: notificationType,
    documentId: data.documentId,
    documentNumber: data.documentNumber,
    clientName: data.clientName,
    amount: data.amount,
    recipientEmail: data.recipientEmail,
    recipientTelegramChatId: data.recipientTelegramChatId,
  };

  await sendNotification(payload);
}

// Main notification sender
async function sendNotification(payload: NotificationPayload): Promise<{ success: boolean; channels: string[] }> {
  const sentChannels: string[] = [];

  // Send Telegram if chat ID provided
  if (payload.recipientTelegramChatId) {
    const template = telegramTemplates[payload.type];
    if (template) {
      const message = template(payload);
      const success = await sendTelegram(payload.recipientTelegramChatId, message);
      if (success) sentChannels.push("telegram");
      await logNotification(payload, "telegram", success);
    }
  }

  // Send Email if email provided
  if (payload.recipientEmail) {
    const template = emailTemplates[payload.type];
    if (template) {
      const subject = template.subject.replace("{documentNumber}", payload.documentNumber || "");
      const html = template.body(payload);
      const success = await sendEmail(payload.recipientEmail, subject, html);
      if (success) sentChannels.push("email");
      await logNotification(payload, "email", success);
    }
  }

  // Forward to n8n for additional automation
  const n8nSuccess = await sendToN8N(payload);
  if (n8nSuccess) sentChannels.push("n8n");

  // Publish failure event if all channels failed
  if (sentChannels.length === 0 && (payload.recipientEmail || payload.recipientTelegramChatId)) {
    console.error("All notification channels failed for:", payload);
  }

  return { success: sentChannels.length > 0, channels: sentChannels };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Handle domain events
    if (body.event) {
      await processDomainEvent(body.event as DomainEvent, body.data || body);
      return new Response(JSON.stringify({ success: true, processed: body.event }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle direct notification requests
    const payload: NotificationPayload = body;

    if (!payload.type) {
      throw new Error("Notification type is required");
    }

    const result = await sendNotification(payload);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Notification error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

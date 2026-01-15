import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Notification types
type NotificationType = 
  | "quote_created"
  | "quote_approved"
  | "quote_rejected"
  | "quote_expired"
  | "proforma_updated"
  | "invoice_issued"
  | "payment_received"
  | "payment_reminder";

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
}

// Email templates
const emailTemplates: Record<NotificationType, { subject: string; body: (data: any) => string }> = {
  quote_created: {
    subject: "Nueva Cotización #{documentNumber} - ALITO GROUP SRL",
    body: (d) => `
      <h2>Nueva Cotización Generada</h2>
      <p>Estimado/a ${d.clientName},</p>
      <p>Se ha generado la cotización <strong>#${d.documentNumber}</strong> por un monto de <strong>RD$${d.amount?.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>.</p>
      <p>Por favor revise los detalles y confirme su aprobación.</p>
      <p>Atentamente,<br/>ALITO GROUP SRL</p>
    `,
  },
  quote_approved: {
    subject: "Cotización #{documentNumber} Aprobada - ALITO GROUP SRL",
    body: (d) => `
      <h2>Cotización Aprobada</h2>
      <p>La cotización <strong>#${d.documentNumber}</strong> ha sido aprobada.</p>
      <p>Procederemos a coordinar los servicios acordados.</p>
      <p>Atentamente,<br/>ALITO GROUP SRL</p>
    `,
  },
  quote_rejected: {
    subject: "Cotización #{documentNumber} - Estado Actualizado",
    body: (d) => `
      <h2>Cotización No Aprobada</h2>
      <p>Lamentamos informar que la cotización <strong>#${d.documentNumber}</strong> no fue aprobada.</p>
      <p>Si desea discutir alternativas, no dude en contactarnos.</p>
      <p>Atentamente,<br/>ALITO GROUP SRL</p>
    `,
  },
  quote_expired: {
    subject: "Cotización #{documentNumber} Expirada - ALITO GROUP SRL",
    body: (d) => `
      <h2>Cotización Expirada</h2>
      <p>La cotización <strong>#${d.documentNumber}</strong> ha expirado.</p>
      <p>Si aún necesita nuestros servicios, solicite una nueva cotización con precios actualizados.</p>
      <p>Atentamente,<br/>ALITO GROUP SRL</p>
    `,
  },
  proforma_updated: {
    subject: "Actualización Proforma - ALITO GROUP SRL",
    body: (d) => `
      <h2>Proforma Actualizada</h2>
      <p>Se han registrado nuevas entregas en su proforma.</p>
      <p>${d.customMessage || ""}</p>
      <p>Atentamente,<br/>ALITO GROUP SRL</p>
    `,
  },
  invoice_issued: {
    subject: "Factura #{documentNumber} Emitida - ALITO GROUP SRL",
    body: (d) => `
      <h2>Factura Fiscal Emitida</h2>
      <p>Estimado/a ${d.clientName},</p>
      <p>Se ha emitido la factura <strong>#${d.documentNumber}</strong> por un monto de <strong>RD$${d.amount?.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>.</p>
      <p>Por favor proceda con el pago según los términos acordados.</p>
      <p>Atentamente,<br/>ALITO GROUP SRL</p>
    `,
  },
  payment_received: {
    subject: "Pago Recibido - ALITO GROUP SRL",
    body: (d) => `
      <h2>Confirmación de Pago</h2>
      <p>Hemos recibido su pago por <strong>RD$${d.amount?.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>.</p>
      <p>Gracias por su confianza.</p>
      <p>Atentamente,<br/>ALITO GROUP SRL</p>
    `,
  },
  payment_reminder: {
    subject: "Recordatorio de Pago - ALITO GROUP SRL",
    body: (d) => `
      <h2>Recordatorio de Pago</h2>
      <p>Le recordamos que tiene un saldo pendiente de <strong>RD$${d.amount?.toLocaleString("es-DO", { minimumFractionDigits: 2 })}</strong>.</p>
      <p>Por favor proceda con el pago a la brevedad posible.</p>
      <p>Atentamente,<br/>ALITO GROUP SRL</p>
    `,
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
  payment_received: (d) => `💰 <b>Pago Recibido</b>\n\nRD$${d.amount?.toLocaleString("es-DO")}`,
  payment_reminder: (d) => `⚠️ <b>Recordatorio de Pago</b>\n\nSaldo pendiente: RD$${d.amount?.toLocaleString("es-DO")}`,
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

// Log notification to database
async function logNotification(payload: NotificationPayload, channel: string, success: boolean, error?: string) {
  // For now, just log to console
  // TODO: Create notifications log table
  console.log(`Notification [${channel}] ${payload.type}: ${success ? "SUCCESS" : "FAILED"}`, error || "");
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

  // Email would be sent here (requires email provider integration)
  if (payload.recipientEmail) {
    // TODO: Integrate with SendGrid/Resend/SES
    console.log("Email notification pending:", payload.recipientEmail);
    // For now, just log it
    await logNotification(payload, "email", false, "Email provider not configured");
  }

  return { success: sentChannels.length > 0, channels: sentChannels };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();

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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Telegram API helper
async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: object) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };
  if (replyMarkup) body.reply_markup = replyMarkup;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

// Get user session/context
async function getUserSession(chatId: number) {
  const { data } = await supabase
    .from("telegram_sessions")
    .select("*")
    .eq("chat_id", chatId)
    .single();
  return data;
}

async function setUserSession(chatId: number, state: string, data: object = {}) {
  const { error } = await supabase
    .from("telegram_sessions")
    .upsert({
      chat_id: chatId,
      state,
      data,
      updated_at: new Date().toISOString(),
    }, { onConflict: "chat_id" });
  if (error) console.error("Session error:", error);
}

async function clearUserSession(chatId: number) {
  await supabase.from("telegram_sessions").delete().eq("chat_id", chatId);
}

// AI helper for extracting quote data
async function extractQuoteDataWithAI(message: string) {
  const systemPrompt = `Eres un asistente que extrae datos de cotizaciones de mensajes en español.
Extrae la siguiente información en formato JSON:
{
  "client_name": "nombre del cliente o empresa",
  "client_rnc": "RNC si se menciona (formato: XXX-XXXXX-X)",
  "client_phone": "teléfono si se menciona",
  "client_email": "email si se menciona",
  "items": [
    {
      "equipment_name": "nombre del equipo",
      "description": "descripción adicional",
      "quantity": número,
      "unit": "PA/VJ/DIA/HR/UN",
      "unit_price": número o null si no se especifica
    }
  ],
  "location": "ubicación del trabajo",
  "notes": "notas adicionales"
}

Si no puedes extraer algún campo, déjalo como null o array vacío.
Responde SOLO con el JSON, sin explicaciones.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    }),
  });

  if (!response.ok) {
    console.error("AI error:", await response.text());
    return null;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  
  try {
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Parse error:", e);
  }
  return null;
}

// Get or create client
async function getOrCreateClient(clientData: { name: string; rnc?: string; phone?: string; email?: string }) {
  if (!clientData.name) return null;

  // Try to find existing client
  let { data: client } = await supabase
    .from("clients")
    .select("*")
    .or(`name.ilike.%${clientData.name}%${clientData.rnc ? `,rnc.eq.${clientData.rnc}` : ""}`)
    .limit(1)
    .single();

  if (!client) {
    // Create new client
    const { data: newClient, error } = await supabase
      .from("clients")
      .insert({
        name: clientData.name,
        rnc: clientData.rnc || null,
        contact_phone: clientData.phone || null,
        contact_email: clientData.email || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Client creation error:", error);
      return null;
    }
    client = newClient;
  }

  return client;
}

// Find or match equipment
async function findEquipment(name: string) {
  const { data } = await supabase
    .from("equipment")
    .select("*")
    .or(`name.ilike.%${name}%,code.ilike.%${name}%`)
    .eq("is_active", true)
    .limit(1)
    .single();
  return data;
}

// Create quote
async function createQuote(clientId: string, items: any[], location?: string, notes?: string) {
  // Get next document number
  const { data: docNumber } = await supabase.rpc("get_next_document_number", { doc_type: "cotizacion" });

  // Create document
  const { data: document, error: docError } = await supabase
    .from("documents")
    .insert({
      document_type: "cotizacion",
      document_number: docNumber,
      client_id: clientId,
      status: "borrador",
      location: location || null,
      notes: notes || null,
      issue_date: new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (docError || !document) {
    console.error("Document creation error:", docError);
    return null;
  }

  // Create document items
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const equipment = await findEquipment(item.equipment_name);
    
    const unitPrice = item.unit_price || equipment?.default_price || 0;
    const quantity = item.quantity || 1;
    const total = unitPrice * quantity;

    await supabase.from("document_items").insert({
      document_id: document.id,
      equipment_id: equipment?.id || null,
      equipment_name: item.equipment_name,
      description: item.description || null,
      quantity,
      unit: item.unit || equipment?.default_unit || "UN",
      unit_price: unitPrice,
      is_taxable: equipment?.is_taxable ?? true,
      total,
      sort_order: i + 1,
    });
  }

  // Re-fetch document with calculated totals
  const { data: finalDoc } = await supabase
    .from("documents")
    .select("*, clients(*)")
    .eq("id", document.id)
    .single();

  return finalDoc;
}

// Get user's quotes
async function getUserQuotes(chatId: number, status?: string) {
  let query = supabase
    .from("documents")
    .select("*, clients(name)")
    .eq("document_type", "cotizacion")
    .order("created_at", { ascending: false })
    .limit(10);

  if (status) {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return data || [];
}

// Format quote summary
function formatQuoteSummary(doc: any): string {
  const statusEmoji: Record<string, string> = {
    borrador: "📝",
    enviado: "📤",
    aprobado: "✅",
    rechazado: "❌",
    pagado: "💰",
    cancelado: "🚫",
  };

  return `${statusEmoji[doc.status] || "📄"} <b>${doc.document_number}</b>
👤 ${doc.clients?.name || "Sin cliente"}
💵 Total: RD$${Number(doc.total || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
📅 ${new Date(doc.issue_date).toLocaleDateString("es-DO")}
📊 Estado: ${doc.status.toUpperCase()}`;
}

// Main menu keyboard
function getMainMenuKeyboard() {
  return {
    keyboard: [
      [{ text: "📝 Nueva Cotización" }, { text: "📋 Mis Cotizaciones" }],
      [{ text: "👥 Clientes" }, { text: "🔧 Equipos" }],
      [{ text: "📊 Estadísticas" }, { text: "⚙️ Configuración" }],
      [{ text: "❓ Ayuda" }],
    ],
    resize_keyboard: true,
  };
}

// Handle commands
async function handleCommand(chatId: number, command: string, message: any) {
  switch (command) {
    case "/start":
      await clearUserSession(chatId);
      await sendTelegramMessage(
        chatId,
        `🎉 <b>¡Bienvenido al Bot de Cotizaciones ALITO GROUP!</b>

Soy tu asistente inteligente para gestionar cotizaciones. Puedo ayudarte a:

📝 Crear cotizaciones con IA
📋 Ver y buscar cotizaciones
👥 Gestionar clientes
🔧 Catálogo de equipos
📊 Ver estadísticas

<i>Usa el menú de abajo o escríbeme en lenguaje natural lo que necesitas.</i>`,
        getMainMenuKeyboard()
      );
      break;

    case "/nueva":
    case "/cotizacion":
      await setUserSession(chatId, "awaiting_quote_details");
      await sendTelegramMessage(
        chatId,
        `📝 <b>Nueva Cotización</b>

Describe tu cotización con los siguientes datos:
• Nombre del cliente
• Equipos necesarios (con cantidad)
• Ubicación del trabajo
• Notas adicionales

<i>Ejemplo: "Cotización para REQUIXES SRL, necesitan 2 minicargadores por 3 días en Punta Cana, incluir transporte"</i>`,
        { remove_keyboard: false }
      );
      break;

    case "/cotizaciones":
      const quotes = await getUserQuotes(chatId);
      if (quotes.length === 0) {
        await sendTelegramMessage(chatId, "📭 No tienes cotizaciones aún. Usa /nueva para crear una.");
      } else {
        const list = quotes.map(formatQuoteSummary).join("\n\n");
        await sendTelegramMessage(chatId, `📋 <b>Últimas Cotizaciones</b>\n\n${list}`);
      }
      break;

    case "/clientes":
      const { data: clients } = await supabase
        .from("clients")
        .select("*")
        .eq("is_active", true)
        .order("name")
        .limit(20);

      if (!clients?.length) {
        await sendTelegramMessage(chatId, "👥 No hay clientes registrados.");
      } else {
        const clientList = clients
          .map((c: any) => `• <b>${c.name}</b>${c.rnc ? ` (${c.rnc})` : ""}`)
          .join("\n");
        await sendTelegramMessage(chatId, `👥 <b>Clientes Activos</b>\n\n${clientList}`);
      }
      break;

    case "/equipos":
      const { data: equipment } = await supabase
        .from("equipment")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true })
        .limit(30);

      if (!equipment?.length) {
        await sendTelegramMessage(chatId, "🔧 No hay equipos registrados.");
      } else {
        const equipList = equipment
          .map((e: any) => `• <b>${e.name}</b> - RD$${e.default_price?.toLocaleString("es-DO") || "N/A"}/${e.default_unit || "UN"}`)
          .join("\n");
        await sendTelegramMessage(chatId, `🔧 <b>Catálogo de Equipos</b>\n\n${equipList}`);
      }
      break;

    case "/stats":
      const { data: stats } = await supabase
        .from("documents")
        .select("status, total")
        .eq("document_type", "cotizacion");

      if (stats) {
        const total = stats.length;
        const aprobadas = stats.filter((s: any) => s.status === "aprobado").length;
        const pendientes = stats.filter((s: any) => s.status === "borrador" || s.status === "enviado").length;
        const montoTotal = stats.reduce((acc: number, s: any) => acc + Number(s.total || 0), 0);

        await sendTelegramMessage(
          chatId,
          `📊 <b>Estadísticas de Cotizaciones</b>

📄 Total: ${total}
✅ Aprobadas: ${aprobadas}
⏳ Pendientes: ${pendientes}
💰 Monto Total: RD$${montoTotal.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`
        );
      }
      break;

    case "/ayuda":
    case "/help":
      await sendTelegramMessage(
        chatId,
        `❓ <b>Comandos Disponibles</b>

/start - Iniciar bot
/nueva - Nueva cotización
/cotizaciones - Ver cotizaciones
/clientes - Ver clientes
/equipos - Ver catálogo
/stats - Estadísticas
/ayuda - Este mensaje

<i>También puedes escribirme en lenguaje natural, por ejemplo:</i>
"Quiero hacer una cotización para empresa ABC, necesitan un excavador por 5 días"`
      );
      break;

    default:
      await sendTelegramMessage(chatId, "❓ Comando no reconocido. Usa /ayuda para ver los comandos disponibles.");
  }
}

// Handle menu buttons
async function handleMenuButton(chatId: number, text: string) {
  switch (text) {
    case "📝 Nueva Cotización":
      await handleCommand(chatId, "/nueva", {});
      break;
    case "📋 Mis Cotizaciones":
      await handleCommand(chatId, "/cotizaciones", {});
      break;
    case "👥 Clientes":
      await handleCommand(chatId, "/clientes", {});
      break;
    case "🔧 Equipos":
      await handleCommand(chatId, "/equipos", {});
      break;
    case "📊 Estadísticas":
      await handleCommand(chatId, "/stats", {});
      break;
    case "⚙️ Configuración":
      await sendTelegramMessage(chatId, "⚙️ <b>Configuración</b>\n\nPróximamente podrás configurar tu perfil y preferencias aquí.");
      break;
    case "❓ Ayuda":
      await handleCommand(chatId, "/ayuda", {});
      break;
    default:
      return false;
  }
  return true;
}

// Process natural language quote request
async function processQuoteRequest(chatId: number, text: string) {
  await sendTelegramMessage(chatId, "🤖 Analizando tu solicitud con IA...");

  const extractedData = await extractQuoteDataWithAI(text);

  if (!extractedData || !extractedData.items?.length) {
    await sendTelegramMessage(
      chatId,
      `❌ No pude extraer los datos de la cotización.

Por favor, incluye al menos:
• Nombre del cliente
• Equipos o servicios con cantidades

<i>Ejemplo: "Cotización para REQUIXES SRL, 2 minicargadores por 3 días"</i>`,
      getMainMenuKeyboard()
    );
    await clearUserSession(chatId);
    return;
  }

  // Store extracted data in session for confirmation
  await setUserSession(chatId, "confirm_quote", extractedData);

  let summary = `🔍 <b>Datos Extraídos:</b>\n\n`;
  summary += `👤 Cliente: ${extractedData.client_name || "No especificado"}\n`;
  if (extractedData.client_rnc) summary += `🆔 RNC: ${extractedData.client_rnc}\n`;
  if (extractedData.location) summary += `📍 Ubicación: ${extractedData.location}\n`;
  
  summary += `\n📦 <b>Items:</b>\n`;
  for (const item of extractedData.items) {
    summary += `• ${item.equipment_name}`;
    if (item.quantity > 1) summary += ` x${item.quantity}`;
    if (item.unit) summary += ` (${item.unit})`;
    if (item.unit_price) summary += ` - RD$${item.unit_price.toLocaleString("es-DO")}`;
    summary += `\n`;
  }

  if (extractedData.notes) summary += `\n📝 Notas: ${extractedData.notes}`;

  summary += `\n\n¿Deseas crear esta cotización?`;

  await sendTelegramMessage(chatId, summary, {
    inline_keyboard: [
      [
        { text: "✅ Crear Cotización", callback_data: "confirm_quote" },
        { text: "❌ Cancelar", callback_data: "cancel_quote" },
      ],
    ],
  });
}

// Handle callback queries (inline buttons)
async function handleCallbackQuery(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "confirm_quote") {
    const session = await getUserSession(chatId);
    if (!session || session.state !== "confirm_quote") {
      await sendTelegramMessage(chatId, "⚠️ Sesión expirada. Usa /nueva para crear una cotización.");
      return;
    }

    const quoteData = session.data;
    await sendTelegramMessage(chatId, "⏳ Creando cotización...");

    // Get or create client
    const client = await getOrCreateClient({
      name: quoteData.client_name,
      rnc: quoteData.client_rnc,
      phone: quoteData.client_phone,
      email: quoteData.client_email,
    });

    if (!client) {
      await sendTelegramMessage(chatId, "❌ Error al crear/buscar cliente. Intenta de nuevo.");
      await clearUserSession(chatId);
      return;
    }

    // Create quote
    const quote = await createQuote(
      client.id,
      quoteData.items,
      quoteData.location,
      quoteData.notes
    );

    if (!quote) {
      await sendTelegramMessage(chatId, "❌ Error al crear cotización. Intenta de nuevo.");
      await clearUserSession(chatId);
      return;
    }

    await clearUserSession(chatId);

    await sendTelegramMessage(
      chatId,
      `✅ <b>¡Cotización Creada!</b>

📄 Número: <code>${quote.document_number}</code>
👤 Cliente: ${client.name}
💰 Total: <b>RD$${Number(quote.total || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}</b>
📊 Estado: BORRADOR

<i>Puedes ver y editar esta cotización en la app web.</i>`,
      getMainMenuKeyboard()
    );
  } else if (data === "cancel_quote") {
    await clearUserSession(chatId);
    await sendTelegramMessage(chatId, "❌ Cotización cancelada.", getMainMenuKeyboard());
  }
}

// Main handler
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Telegram update:", JSON.stringify(body));

    // Handle callback queries (inline button presses)
    if (body.callback_query) {
      await handleCallbackQuery(body.callback_query);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle messages
    const message = body.message;
    if (!message) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const chatId = message.chat.id;
    const text = message.text?.trim() || "";

    // Handle commands
    if (text.startsWith("/")) {
      await handleCommand(chatId, text.split(" ")[0].toLowerCase(), message);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle menu buttons
    if (await handleMenuButton(chatId, text)) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check user session state
    const session = await getUserSession(chatId);

    if (session?.state === "awaiting_quote_details") {
      await processQuoteRequest(chatId, text);
    } else {
      // Default: treat as quote request
      await setUserSession(chatId, "awaiting_quote_details");
      await processQuoteRequest(chatId, text);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

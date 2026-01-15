import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(a.toLowerCase(), b.toLowerCase()) / maxLen;
}

// Detect duplicate customers
async function detectDuplicateCustomers(): Promise<any[]> {
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, rnc, contact_email, contact_phone")
    .eq("is_active", true);

  if (!clients) return [];

  const duplicates: any[] = [];
  const threshold = 0.85;

  for (let i = 0; i < clients.length; i++) {
    for (let j = i + 1; j < clients.length; j++) {
      const c1 = clients[i];
      const c2 = clients[j];

      // Check name similarity
      const nameSim = similarity(c1.name || "", c2.name || "");
      
      // Check RNC match (exact)
      const rncMatch = c1.rnc && c2.rnc && c1.rnc === c2.rnc;
      
      // Check email match
      const emailMatch = c1.contact_email && c2.contact_email && 
        c1.contact_email.toLowerCase() === c2.contact_email.toLowerCase();
      
      // Check phone match
      const phoneMatch = c1.contact_phone && c2.contact_phone &&
        c1.contact_phone.replace(/\D/g, "") === c2.contact_phone.replace(/\D/g, "");

      if (nameSim >= threshold || rncMatch || emailMatch || phoneMatch) {
        duplicates.push({
          client1: c1,
          client2: c2,
          score: {
            nameSimilarity: nameSim,
            rncMatch,
            emailMatch,
            phoneMatch,
          },
          confidence: rncMatch ? 1 : emailMatch || phoneMatch ? 0.95 : nameSim,
        });
      }
    }
  }

  return duplicates.sort((a, b) => b.confidence - a.confidence);
}

// Detect price anomalies in quotes
async function detectPriceAnomalies(documentId?: string): Promise<any[]> {
  let query = supabase
    .from("document_items")
    .select("*, documents!inner(id, document_number, document_type), equipment(default_price, name)")
    .eq("documents.document_type", "cotizacion");

  if (documentId) {
    query = query.eq("document_id", documentId);
  }

  const { data: items } = await query;
  if (!items) return [];

  const anomalies: any[] = [];
  
  for (const item of items) {
    const defaultPrice = item.equipment?.default_price;
    if (!defaultPrice || defaultPrice === 0) continue;

    const deviation = Math.abs(item.unit_price - defaultPrice) / defaultPrice;
    
    // Flag if price differs by more than 30%
    if (deviation > 0.3) {
      anomalies.push({
        documentId: item.document_id,
        documentNumber: item.documents?.document_number,
        itemId: item.id,
        equipmentName: item.equipment_name,
        quotedPrice: item.unit_price,
        catalogPrice: defaultPrice,
        deviation: Math.round(deviation * 100),
        type: item.unit_price > defaultPrice ? "overpriced" : "underpriced",
        severity: deviation > 0.5 ? "high" : "medium",
      });
    }

    // Flag unusual quantities
    if (item.quantity > 100) {
      anomalies.push({
        documentId: item.document_id,
        documentNumber: item.documents?.document_number,
        itemId: item.id,
        equipmentName: item.equipment_name,
        quantity: item.quantity,
        type: "unusual_quantity",
        severity: item.quantity > 500 ? "high" : "medium",
      });
    }
  }

  return anomalies;
}

// Match service item from description using AI
async function matchServiceItem(description: string): Promise<any[]> {
  const { data: equipment } = await supabase
    .from("equipment")
    .select("id, name, code, description, category, default_price, default_unit")
    .eq("is_active", true);

  if (!equipment) return [];

  // First try fuzzy matching
  const matches = equipment
    .map((e) => ({
      ...e,
      score: Math.max(
        similarity(description, e.name || ""),
        similarity(description, e.code || ""),
        similarity(description, e.description || "") * 0.8
      ),
    }))
    .filter((m) => m.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // If no good matches, use AI
  if (matches.length === 0 || matches[0].score < 0.6) {
    const equipmentList = equipment.map((e) => `${e.code || ""}: ${e.name}`).join("\n");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Eres un asistente que ayuda a identificar equipos pesados y servicios de construcción.
Dado un catálogo de equipos y una descripción, identifica los equipos que coinciden.
Responde solo con los códigos de los equipos que coinciden, separados por comas.
Si no hay coincidencia clara, responde "NONE".`,
          },
          {
            role: "user",
            content: `Catálogo:\n${equipmentList}\n\nDescripción del usuario: "${description}"`,
          },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const codes = data.choices?.[0]?.message?.content?.split(",").map((c: string) => c.trim()) || [];
      
      for (const code of codes) {
        const match = equipment.find((e) => e.code === code || e.name.includes(code));
        if (match && !matches.find((m) => m.id === match.id)) {
          matches.push({ ...match, score: 0.7 });
        }
      }
    }
  }

  return matches.slice(0, 3);
}

// Map phone to customer
async function mapPhoneToCustomer(phone: string): Promise<any | null> {
  const cleanPhone = phone.replace(/\D/g, "");
  
  // Try exact match first
  let { data: client } = await supabase
    .from("clients")
    .select("*")
    .or(`contact_phone.ilike.%${cleanPhone}%`)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (client) return client;

  // Try partial match (last 7-10 digits)
  if (cleanPhone.length >= 7) {
    const partialPhone = cleanPhone.slice(-10);
    const { data: clients } = await supabase
      .from("clients")
      .select("*")
      .eq("is_active", true);

    if (clients) {
      for (const c of clients) {
        const clientPhone = (c.contact_phone || "").replace(/\D/g, "");
        if (clientPhone.includes(partialPhone) || partialPhone.includes(clientPhone.slice(-7))) {
          return c;
        }
      }
    }
  }

  return null;
}

// Extract data from message using AI
async function extractDataFromMessage(message: string, type: "quote" | "client" | "general"): Promise<any> {
  const prompts: Record<string, string> = {
    quote: `Extrae datos de cotización del mensaje. Devuelve JSON con:
{
  "client_name": "nombre",
  "items": [{"equipment_name": "equipo", "quantity": número, "unit": "PA/VJ/DIA", "unit_price": número|null}],
  "location": "ubicación",
  "notes": "notas"
}`,
    client: `Extrae datos de cliente del mensaje. Devuelve JSON con:
{
  "name": "nombre empresa",
  "rnc": "RNC si hay",
  "contact_name": "nombre contacto",
  "contact_phone": "teléfono",
  "contact_email": "email",
  "address": "dirección",
  "city": "ciudad"
}`,
    general: `Analiza el mensaje y extrae cualquier información relevante para facturación. Devuelve JSON estructurado.`,
  };

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: prompts[type] + "\nResponde SOLO con JSON válido." },
        { role: "user", content: message },
      ],
    }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    let result: any;

    switch (action) {
      case "detect_duplicates":
        result = await detectDuplicateCustomers();
        break;

      case "detect_anomalies":
        result = await detectPriceAnomalies(params.documentId);
        break;

      case "match_service":
        result = await matchServiceItem(params.description);
        break;

      case "map_phone":
        result = await mapPhoneToCustomer(params.phone);
        break;

      case "extract_data":
        result = await extractDataFromMessage(params.message, params.type || "general");
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("AI Assist error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

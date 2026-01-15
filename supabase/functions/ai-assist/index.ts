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

// ========== UTILITY FUNCTIONS ==========

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

// Jaro-Winkler similarity (better for names)
function jaroWinkler(s1: string, s2: string): number {
  if (s1 === s2) return 1;
  
  const len1 = s1.length;
  const len2 = s2.length;
  
  if (len1 === 0 || len2 === 0) return 0;
  
  const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);
  
  let matches = 0;
  let transpositions = 0;
  
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, len2);
    
    for (let j = start; j < end; j++) {
      if (s2Matches[j] || s1[i] !== s2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }
  
  if (matches === 0) return 0;
  
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }
  
  const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
  
  // Winkler prefix bonus
  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(len1, len2)); i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }
  
  return jaro + prefix * 0.1 * (1 - jaro);
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(a.toLowerCase(), b.toLowerCase()) / maxLen;
}

// ========== DUPLICATE DETECTION ==========

interface DuplicateMatch {
  client1: any;
  client2: any;
  score: {
    nameSimilarity: number;
    jaroWinkler: number;
    rncMatch: boolean;
    emailMatch: boolean;
    phoneMatch: boolean;
  };
  confidence: number;
  reason: string;
}

async function detectDuplicateCustomers(): Promise<DuplicateMatch[]> {
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, rnc, contact_email, contact_phone, contact_name, address, city")
    .eq("is_active", true);

  if (!clients || clients.length < 2) return [];

  const duplicates: DuplicateMatch[] = [];
  const threshold = 0.80;

  for (let i = 0; i < clients.length; i++) {
    for (let j = i + 1; j < clients.length; j++) {
      const c1 = clients[i];
      const c2 = clients[j];

      // Check name similarity using multiple algorithms
      const nameLev = similarity(c1.name || "", c2.name || "");
      const nameJW = jaroWinkler((c1.name || "").toLowerCase(), (c2.name || "").toLowerCase());
      const nameSim = Math.max(nameLev, nameJW);
      
      // Check RNC match (exact, after normalization)
      const normalizeRnc = (r: string) => (r || "").replace(/\D/g, "");
      const rnc1 = normalizeRnc(c1.rnc);
      const rnc2 = normalizeRnc(c2.rnc);
      const rncMatch = rnc1 && rnc2 && rnc1 === rnc2;
      
      // Check email match
      const email1 = (c1.contact_email || "").toLowerCase().trim();
      const email2 = (c2.contact_email || "").toLowerCase().trim();
      const emailMatch = email1 && email2 && email1 === email2;
      
      // Check phone match (normalize to digits only)
      const normalizePhone = (p: string) => (p || "").replace(/\D/g, "").slice(-10);
      const phone1 = normalizePhone(c1.contact_phone);
      const phone2 = normalizePhone(c2.contact_phone);
      const phoneMatch = phone1 && phone2 && phone1 === phone2;

      // Calculate confidence and determine if duplicate
      let confidence = 0;
      let reason = "";

      if (rncMatch) {
        confidence = 1.0;
        reason = "RNC idéntico";
      } else if (emailMatch && phoneMatch) {
        confidence = 0.98;
        reason = "Email y teléfono idénticos";
      } else if (emailMatch) {
        confidence = 0.95;
        reason = "Email idéntico";
      } else if (phoneMatch) {
        confidence = 0.90;
        reason = "Teléfono idéntico";
      } else if (nameSim >= 0.9) {
        confidence = nameSim * 0.85;
        reason = `Nombre muy similar (${Math.round(nameSim * 100)}%)`;
      } else if (nameSim >= threshold) {
        confidence = nameSim * 0.7;
        reason = `Nombre similar (${Math.round(nameSim * 100)}%)`;
      }

      if (confidence >= 0.6) {
        duplicates.push({
          client1: c1,
          client2: c2,
          score: {
            nameSimilarity: nameLev,
            jaroWinkler: nameJW,
            rncMatch,
            emailMatch,
            phoneMatch,
          },
          confidence,
          reason,
        });
      }
    }
  }

  return duplicates.sort((a, b) => b.confidence - a.confidence);
}

// ========== ANOMALY DETECTION ==========

interface PriceAnomaly {
  documentId: string;
  documentNumber: string;
  itemId: string;
  equipmentName: string;
  quotedPrice: number;
  catalogPrice: number;
  deviation: number;
  type: "overpriced" | "underpriced" | "unusual_quantity";
  severity: "low" | "medium" | "high";
  recommendation: string;
}

async function detectPriceAnomalies(documentId?: string): Promise<PriceAnomaly[]> {
  let query = supabase
    .from("document_items")
    .select("*, documents!inner(id, document_number, document_type), equipment(default_price, name)")
    .eq("documents.document_type", "cotizacion");

  if (documentId) {
    query = query.eq("document_id", documentId);
  }

  const { data: items } = await query;
  if (!items) return [];

  const anomalies: PriceAnomaly[] = [];
  
  // Get historical averages for comparison
  const { data: avgPrices } = await supabase
    .from("document_items")
    .select("equipment_id, unit_price");

  const priceHistory: Record<string, number[]> = {};
  avgPrices?.forEach((item) => {
    if (item.equipment_id && item.unit_price) {
      if (!priceHistory[item.equipment_id]) priceHistory[item.equipment_id] = [];
      priceHistory[item.equipment_id].push(item.unit_price);
    }
  });

  for (const item of items) {
    const catalogPrice = item.equipment?.default_price || 0;
    
    if (catalogPrice > 0) {
      const deviation = Math.abs(item.unit_price - catalogPrice) / catalogPrice;
      
      if (deviation > 0.20) {
        const severity = deviation > 0.5 ? "high" : deviation > 0.3 ? "medium" : "low";
        const type = item.unit_price > catalogPrice ? "overpriced" : "underpriced";
        
        anomalies.push({
          documentId: item.document_id,
          documentNumber: item.documents?.document_number || "",
          itemId: item.id,
          equipmentName: item.equipment_name,
          quotedPrice: item.unit_price,
          catalogPrice,
          deviation: Math.round(deviation * 100),
          type,
          severity,
          recommendation: type === "overpriced" 
            ? `Precio ${deviation > 0.5 ? "muy" : ""} por encima del catálogo. Verificar justificación.`
            : `Precio ${deviation > 0.5 ? "muy" : ""} por debajo del catálogo. Verificar margen.`,
        });
      }
    }

    // Check for unusual quantities
    if (item.quantity > 50) {
      anomalies.push({
        documentId: item.document_id,
        documentNumber: item.documents?.document_number || "",
        itemId: item.id,
        equipmentName: item.equipment_name,
        quotedPrice: item.unit_price,
        catalogPrice,
        deviation: 0,
        type: "unusual_quantity",
        severity: item.quantity > 200 ? "high" : item.quantity > 100 ? "medium" : "low",
        recommendation: `Cantidad inusualmente alta (${item.quantity}). Verificar con cliente.`,
      });
    }
  }

  return anomalies.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

// ========== SERVICE MATCHING ==========

interface ServiceMatch {
  id: string;
  name: string;
  code: string;
  category: string;
  default_price: number;
  default_unit: string;
  score: number;
  matchType: "exact" | "fuzzy" | "ai";
}

async function matchServiceItem(description: string): Promise<ServiceMatch[]> {
  const { data: equipment } = await supabase
    .from("equipment")
    .select("id, name, code, description, category, default_price, default_unit")
    .eq("is_active", true);

  if (!equipment) return [];

  // Normalize description
  const normalizedDesc = description.toLowerCase().trim();
  
  // Try exact matches first
  const exactMatches = equipment.filter((e) => {
    const name = (e.name || "").toLowerCase();
    const code = (e.code || "").toLowerCase();
    return name === normalizedDesc || code === normalizedDesc || name.includes(normalizedDesc);
  }).map((e) => ({ ...e, score: 1.0, matchType: "exact" as const }));

  if (exactMatches.length > 0) {
    return exactMatches.slice(0, 3);
  }

  // Fuzzy matching
  const fuzzyMatches = equipment
    .map((e) => {
      const nameScore = Math.max(
        similarity(normalizedDesc, (e.name || "").toLowerCase()),
        jaroWinkler(normalizedDesc, (e.name || "").toLowerCase())
      );
      const codeScore = similarity(normalizedDesc, (e.code || "").toLowerCase());
      const descScore = similarity(normalizedDesc, (e.description || "").toLowerCase()) * 0.7;
      
      return {
        ...e,
        score: Math.max(nameScore, codeScore, descScore),
        matchType: "fuzzy" as const,
      };
    })
    .filter((m) => m.score > 0.4)
    .sort((a, b) => b.score - a.score);

  if (fuzzyMatches.length > 0 && fuzzyMatches[0].score > 0.7) {
    return fuzzyMatches.slice(0, 3);
  }

  // Use AI for ambiguous cases
  const equipmentList = equipment.slice(0, 50).map((e) => `${e.code || "N/A"}: ${e.name}`).join("\n");
  
  try {
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
            content: `Eres un experto en equipos de construcción dominicano.
Dado un catálogo y una descripción del usuario, identifica los equipos que coinciden.
Considera variaciones de nombres (ej: "retro" = "retroexcavadora", "volteo" = "camión volquete").
Responde SOLO con los códigos de los 3 mejores matches, separados por comas.
Si no hay coincidencia clara, responde "NONE".`,
          },
          {
            role: "user",
            content: `Catálogo:\n${equipmentList}\n\nDescripción: "${description}"`,
          },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      
      if (content !== "NONE") {
        const codes = content.split(",").map((c: string) => c.trim().toUpperCase());
        const aiMatches = codes
          .map((code: string) => equipment.find((e) => 
            (e.code || "").toUpperCase() === code || 
            (e.name || "").toUpperCase().includes(code)
          ))
          .filter(Boolean)
          .map((e: any) => ({ ...e, score: 0.75, matchType: "ai" as const }));
        
        if (aiMatches.length > 0) {
          return aiMatches.slice(0, 3);
        }
      }
    }
  } catch (error) {
    console.error("AI matching error:", error);
  }

  // Return best fuzzy matches as fallback
  return fuzzyMatches.slice(0, 3);
}

// ========== PHONE TO CUSTOMER MAPPING ==========

async function mapPhoneToCustomer(phone: string): Promise<any | null> {
  const cleanPhone = phone.replace(/\D/g, "");
  
  if (cleanPhone.length < 7) return null;
  
  // Try exact match first
  const { data: exactMatch } = await supabase
    .from("clients")
    .select("*")
    .or(`contact_phone.ilike.%${cleanPhone}%`)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (exactMatch) return { ...exactMatch, matchType: "exact" };

  // Try partial match (last 7-10 digits)
  const partialPhone = cleanPhone.slice(-10);
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("is_active", true);

  if (clients) {
    for (const c of clients) {
      const clientPhone = (c.contact_phone || "").replace(/\D/g, "");
      if (clientPhone.length >= 7) {
        if (clientPhone.includes(partialPhone) || partialPhone.includes(clientPhone.slice(-7))) {
          return { ...c, matchType: "partial" };
        }
      }
    }
  }

  // Store mapping for future reference
  console.log(`No client found for phone: ${phone}`);
  return null;
}

// ========== DATA EXTRACTION ==========

async function extractDataFromMessage(message: string, type: "quote" | "client" | "general"): Promise<any> {
  const prompts: Record<string, string> = {
    quote: `Eres un experto en cotizaciones de alquiler de equipos pesados en República Dominicana.
Extrae datos de cotización del mensaje. Devuelve JSON con:
{
  "client_name": "nombre del cliente o empresa",
  "client_rnc": "RNC si se menciona (formato XXX-XXXXX-X)",
  "items": [
    {
      "equipment_name": "nombre del equipo",
      "quantity": número,
      "unit": "PA|VJ|DIA|M3|UN|HR|KG|LT",
      "unit_price": número o null,
      "description": "detalles adicionales"
    }
  ],
  "location": "ubicación del proyecto",
  "execution_date": "fecha si se menciona",
  "notes": "condiciones o notas adicionales",
  "confidence": 0.0-1.0
}

Unidades comunes:
- PA: Partida (trabajo completo)
- VJ: Viaje
- DIA: Día de alquiler
- M3: Metro cúbico
- HR: Hora`,
    client: `Extrae datos de cliente del mensaje. Devuelve JSON con:
{
  "name": "nombre empresa o persona",
  "rnc": "RNC si hay (formato XXX-XXXXX-X o 9 dígitos)",
  "contact_name": "nombre de la persona de contacto",
  "contact_phone": "teléfono (formato 809-XXX-XXXX)",
  "contact_email": "email si hay",
  "address": "dirección",
  "city": "ciudad",
  "confidence": 0.0-1.0
}`,
    general: `Analiza el mensaje y extrae cualquier información relevante para un sistema de facturación de equipos pesados.
Identifica: clientes, equipos, cantidades, fechas, ubicaciones, precios.
Devuelve JSON estructurado con la información encontrada y un campo "intent" indicando qué quiere el usuario.`,
  };

  try {
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

    if (!response.ok) {
      console.error("AI extraction failed:", response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error("Data extraction error:", error);
    return null;
  }
}

// ========== MAIN HANDLER ==========

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

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

// OCR using AI Vision model
async function extractTextFromImage(imageUrl: string): Promise<{
  text: string;
  confidence: number;
  language: string;
}> {
  console.log("Extracting text from image:", imageUrl);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        {
          role: "system",
          content: `Eres un servicio OCR especializado en documentos de facturación en español dominicano.
Extrae TODO el texto visible de la imagen de manera precisa.
Mantén el formato original (líneas, tablas, columnas).
Identifica y separa claramente: encabezados, datos de cliente, items, totales.
Responde en JSON: {"text": "texto extraído", "confidence": 0.0-1.0, "language": "es", "structured_data": {...}}`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
            {
              type: "text",
              text: "Extrae todo el texto de esta imagen de documento.",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("OCR Vision error:", error);
    throw new Error(`OCR failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        text: parsed.text || content,
        confidence: parsed.confidence || 0.8,
        language: parsed.language || "es",
      };
    }
  } catch {
    // If JSON parsing fails, return raw text
  }

  return {
    text: content,
    confidence: 0.7,
    language: "es",
  };
}

// Extract text from PDF (base64 encoded)
async function extractTextFromPDF(pdfBase64: string): Promise<{
  text: string;
  pages: number;
  confidence: number;
}> {
  console.log("Extracting text from PDF...");

  // Use AI to analyze PDF content
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        {
          role: "system",
          content: `Eres un servicio de extracción de texto de PDFs.
Extrae todo el texto del documento manteniendo la estructura.
Para documentos de facturación, identifica: cliente, items, precios, totales.
Responde en JSON: {"text": "texto", "pages": número, "confidence": 0.0-1.0, "structured_data": {...}}`,
        },
        {
          role: "user",
          content: [
            {
              type: "file",
              file: {
                filename: "document.pdf",
                file_data: pdfBase64,
              },
            },
            {
              type: "text",
              text: "Extrae todo el texto de este PDF.",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`PDF extraction failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        text: parsed.text || content,
        pages: parsed.pages || 1,
        confidence: parsed.confidence || 0.8,
      };
    }
  } catch {
    // If JSON parsing fails, return raw text
  }

  return {
    text: content,
    pages: 1,
    confidence: 0.7,
  };
}

// Extract structured quote data from text
async function extractQuoteData(text: string): Promise<{
  client_name: string | null;
  client_rnc: string | null;
  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    unit_price: number | null;
  }>;
  subtotal: number | null;
  tax: number | null;
  total: number | null;
  location: string | null;
  notes: string | null;
  confidence: number;
  warnings: string[];
}> {
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
          content: `Eres un experto en extracción de datos de cotizaciones dominicanas.
Extrae la siguiente información del texto:
- client_name: nombre del cliente/empresa
- client_rnc: RNC o cédula (formato: XXX-XXXXX-X o 9 dígitos)
- items: lista de items con description, quantity, unit (PA/VJ/DIA/M3/UN/HR/KG/LT), unit_price
- subtotal, tax (ITBIS 18%), total
- location: ubicación/proyecto
- notes: condiciones, términos
- confidence: 0.0-1.0
- warnings: lista de posibles errores o datos faltantes

Responde SOLO con JSON válido.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Quote extraction failed");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("JSON parse error:", e);
  }

  return {
    client_name: null,
    client_rnc: null,
    items: [],
    subtotal: null,
    tax: null,
    total: null,
    location: null,
    notes: null,
    confidence: 0,
    warnings: ["No se pudo extraer datos estructurados"],
  };
}

// Transcribe audio using AI
async function transcribeAudio(audioUrl: string): Promise<{
  text: string;
  language: string;
  confidence: number;
  duration_seconds: number;
}> {
  console.log("Transcribing audio:", audioUrl);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        {
          role: "system",
          content: `Eres un servicio de transcripción de audio especializado en español dominicano.
Transcribe el audio con precisión, incluyendo modismos locales.
Para mensajes de negocios, identifica: solicitudes, cantidades, equipos, ubicaciones.
Responde en JSON: {"text": "transcripción", "language": "es-DO", "confidence": 0.0-1.0, "duration_seconds": número}`,
        },
        {
          role: "user",
          content: [
            {
              type: "audio_url",
              audio_url: { url: audioUrl },
            },
            {
              type: "text",
              text: "Transcribe este audio.",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // If JSON parsing fails, return raw text
  }

  return {
    text: content,
    language: "es-DO",
    confidence: 0.7,
    duration_seconds: 0,
  };
}

// Process document (image or PDF) and extract quote data
async function processDocument(
  documentUrl: string,
  documentType: "image" | "pdf"
): Promise<{
  raw_text: string;
  quote_data: any;
  confidence: number;
  warnings: string[];
}> {
  let text: string;
  let extractConfidence: number;

  if (documentType === "image") {
    const result = await extractTextFromImage(documentUrl);
    text = result.text;
    extractConfidence = result.confidence;
  } else {
    const result = await extractTextFromPDF(documentUrl);
    text = result.text;
    extractConfidence = result.confidence;
  }

  const quoteData = await extractQuoteData(text);

  return {
    raw_text: text,
    quote_data: quoteData,
    confidence: Math.min(extractConfidence, quoteData.confidence),
    warnings: quoteData.warnings || [],
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    let result: any;

    switch (action) {
      case "extract_text_image":
        result = await extractTextFromImage(params.imageUrl);
        break;

      case "extract_text_pdf":
        result = await extractTextFromPDF(params.pdfBase64);
        break;

      case "extract_quote_data":
        result = await extractQuoteData(params.text);
        break;

      case "transcribe_audio":
        result = await transcribeAudio(params.audioUrl);
        break;

      case "process_document":
        result = await processDocument(params.documentUrl, params.documentType || "image");
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("OCR Service error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

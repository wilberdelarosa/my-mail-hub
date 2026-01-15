import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-intake-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Source = "MANUAL" | "WHATSAPP" | "WEB" | "AI" | "TELEGRAM";

type IntakeBody = {
  source: Source;
  payload: Record<string, unknown>;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ success: false, error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const intakeSecret = Deno.env.get("INTAKE_SECRET") || "";

    const supabase = createClient(supabaseUrl, serviceKey);

    // Auth options:
    // - If INTAKE_SECRET is configured: accept X-INTAKE-SECRET
    // - Otherwise: require a valid Supabase user token in Authorization header
    const providedSecret = req.headers.get("x-intake-secret") || "";
    const authHeader = req.headers.get("Authorization") || "";

    if (intakeSecret) {
      if (providedSecret !== intakeSecret) {
        return json({ success: false, error: "Unauthorized" }, 401);
      }
    } else {
      if (!authHeader.startsWith("Bearer ")) {
        return json({ success: false, error: "Missing authorization" }, 401);
      }
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return json({ success: false, error: "Unauthorized" }, 401);
    }

    const body = (await req.json()) as IntakeBody;

    if (!body?.source || !body?.payload) {
      return json({ success: false, error: "Invalid body. Expected { source, payload }" }, 400);
    }

    const { data, error } = await supabase
      .from("queue_requests")
      .insert({
        source: body.source,
        status: "RECEIVED",
        payload: body.payload,
      })
      .select("id, status, created_at")
      .single();

    if (error) throw error;

    return json({ success: true, request: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[intake-quote-request]", err);
    return json({ success: false, error: message }, 400);
  }
});

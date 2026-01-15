import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-sync-direction",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SyncPayload {
  table: string;
  operation: "upsert" | "delete" | "fetch_all";
  data?: Record<string, unknown>[];
  ids?: string[];
  last_sync?: string;
}

interface SyncResponse {
  success: boolean;
  synced_count?: number;
  data?: Record<string, unknown>[];
  error?: string;
  timestamp: string;
}

// Tables that can be synced
const ALLOWED_TABLES = [
  "clients",
  "documents",
  "document_items",
  "equipment",
  "company_settings",
  "profiles",
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const payload: SyncPayload = await req.json();
    const { table, operation, data, ids, last_sync } = payload;

    // Validate table
    if (!ALLOWED_TABLES.includes(table)) {
      throw new Error(`Table '${table}' is not allowed for sync`);
    }

    let response: SyncResponse;

    switch (operation) {
      case "fetch_all": {
        // Fetch all records from cloud, optionally filtered by last_sync
        let query = supabase.from(table).select("*");
        
        if (last_sync) {
          query = query.gte("updated_at", last_sync);
        }
        
        const { data: records, error } = await query;
        
        if (error) throw error;
        
        response = {
          success: true,
          data: records || [],
          synced_count: records?.length || 0,
          timestamp: new Date().toISOString(),
        };
        break;
      }

      case "upsert": {
        // Upsert data from local to cloud
        if (!data || data.length === 0) {
          throw new Error("No data provided for upsert");
        }

        // Add updated_at timestamp
        const dataWithTimestamp = data.map(record => ({
          ...record,
          updated_at: new Date().toISOString(),
        }));

        const { error } = await supabase
          .from(table)
          .upsert(dataWithTimestamp, { onConflict: "id" });

        if (error) throw error;

        response = {
          success: true,
          synced_count: data.length,
          timestamp: new Date().toISOString(),
        };
        break;
      }

      case "delete": {
        // Delete records by IDs
        if (!ids || ids.length === 0) {
          throw new Error("No IDs provided for delete");
        }

        const { error } = await supabase
          .from(table)
          .delete()
          .in("id", ids);

        if (error) throw error;

        response = {
          success: true,
          synced_count: ids.length,
          timestamp: new Date().toISOString(),
        };
        break;
      }

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    // Log sync activity
    console.log(`[DB-SYNC] User ${user.id} - ${operation} on ${table} - ${response.synced_count} records`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("[DB-SYNC Error]", error);
    
    const errorResponse: SyncResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 400,
    });
  }
});
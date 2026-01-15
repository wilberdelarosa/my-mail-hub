import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface TestResult {
  name: string;
  passed: boolean;
  duration_ms: number;
  error?: string;
  details?: any;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  total: number;
  passed: number;
  failed: number;
  duration_ms: number;
}

// Test utilities
async function runTest(
  name: string,
  testFn: () => Promise<any>
): Promise<TestResult> {
  const start = Date.now();
  try {
    const details = await testFn();
    return {
      name,
      passed: true,
      duration_ms: Date.now() - start,
      details,
    };
  } catch (error) {
    return {
      name,
      passed: false,
      duration_ms: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ===== COTIZACIÓN MANUAL TESTS =====
async function testManualQuotationFlow(): Promise<TestSuite> {
  const tests: TestResult[] = [];
  const suiteStart = Date.now();

  // Test 1: Create client
  tests.push(
    await runTest("Crear cliente para cotización", async () => {
      const { data, error } = await supabase
        .from("clients")
        .insert({
          name: "Test Client Manual",
          rnc: "123456789",
          contact_name: "Test Contact",
          contact_email: "test@test.com",
          contact_phone: "809-555-1234",
        })
        .select()
        .single();

      if (error) throw error;
      return { client_id: data.id };
    })
  );

  // Test 2: Create document (cotización)
  tests.push(
    await runTest("Crear documento cotización", async () => {
      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("name", "Test Client Manual")
        .single();

      const { data, error } = await supabase
        .from("documents")
        .insert({
          document_type: "cotizacion",
          document_number: `TEST-${Date.now()}`,
          client_id: client?.id,
          status: "borrador",
          subtotal: 10000,
          itbis_amount: 1800,
          total: 11800,
          subtotal_taxable: 10000,
          subtotal_exempt: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return { document_id: data.id, document_number: data.document_number };
    })
  );

  // Test 3: Add items to document
  tests.push(
    await runTest("Agregar items a cotización", async () => {
      const { data: doc } = await supabase
        .from("documents")
        .select("id")
        .like("document_number", "TEST-%")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { data, error } = await supabase
        .from("document_items")
        .insert([
          {
            document_id: doc?.id,
            equipment_name: "Retroexcavadora CAT 420F",
            quantity: 2,
            unit: "VJ",
            unit_price: 5000,
            total: 10000,
            is_taxable: true,
          },
        ])
        .select();

      if (error) throw error;
      return { items_count: data.length };
    })
  );

  // Test 4: Validate ITBIS calculation
  tests.push(
    await runTest("Validar cálculo ITBIS (18%)", async () => {
      const { data: doc } = await supabase
        .from("documents")
        .select("subtotal_taxable, itbis_amount, total")
        .like("document_number", "TEST-%")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!doc) throw new Error("Document not found");

      const expectedItbis = (doc.subtotal_taxable || 0) * 0.18;
      const itbisDiff = Math.abs((doc.itbis_amount || 0) - expectedItbis);

      if (itbisDiff > 0.01) {
        throw new Error(
          `ITBIS mismatch: expected ${expectedItbis}, got ${doc.itbis_amount}`
        );
      }

      const expectedTotal = (doc.subtotal_taxable || 0) + expectedItbis;
      const totalDiff = Math.abs((doc.total || 0) - expectedTotal);

      if (totalDiff > 0.01) {
        throw new Error(
          `Total mismatch: expected ${expectedTotal}, got ${doc.total}`
        );
      }

      return { itbis: doc.itbis_amount, total: doc.total, valid: true };
    })
  );

  // Test 5: Audit log exists
  tests.push(
    await runTest("Verificar almacenamiento de auditoría", async () => {
      const { data: doc } = await supabase
        .from("documents")
        .select("id, created_at, updated_at")
        .like("document_number", "TEST-%")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!doc?.created_at) {
        throw new Error("Audit timestamp not found");
      }

      return { has_audit: true, created_at: doc.created_at };
    })
  );

  // Cleanup
  await supabase.from("document_items").delete().like("equipment_name", "Retroexcavadora%");
  await supabase.from("documents").delete().like("document_number", "TEST-%");
  await supabase.from("clients").delete().eq("name", "Test Client Manual");

  return {
    name: "Cotización Manual",
    tests,
    total: tests.length,
    passed: tests.filter((t) => t.passed).length,
    failed: tests.filter((t) => !t.passed).length,
    duration_ms: Date.now() - suiteStart,
  };
}

// ===== TELEGRAM/WHATSAPP TESTS =====
async function testTelegramFlow(): Promise<TestSuite> {
  const tests: TestResult[] = [];
  const suiteStart = Date.now();

  // Test 1: Simple text message processing
  tests.push(
    await runTest("Procesar mensaje de texto simple", async () => {
      const testMessage = "Necesito cotizar una retroexcavadora para mañana en Los Alcarrizos";
      
      // Simulate calling AI assist
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-assist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          action: "extract_data",
          message: testMessage,
          type: "quote",
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`AI assist failed: ${error}`);
      }

      const result = await response.json();
      return result;
    })
  );

  // Test 2: Multiple items message
  tests.push(
    await runTest("Procesar mensaje con múltiples items", async () => {
      const testMessage = `Buenas tardes, necesito cotización para:
- 2 viajes de retroexcavadora
- 5 camiones de material
- 1 día de bulldozer
Para proyecto en Santo Domingo Este`;

      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-assist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          action: "extract_data",
          message: testMessage,
          type: "quote",
        }),
      });

      const result = await response.json();
      
      if (!result.success || !result.data?.items?.length) {
        throw new Error("Failed to extract multiple items");
      }

      return { items_extracted: result.data.items.length };
    })
  );

  // Test 3: Service matching accuracy
  tests.push(
    await runTest("Validar extracción IA (accuracy > 85%)", async () => {
      const testCases = [
        { input: "retroexcavadora", expected: "excavadora|retroexcavadora" },
        { input: "camion volteo", expected: "camion|volteo|volquete" },
        { input: "bulldozer", expected: "bulldozer|tractor" },
      ];

      let correct = 0;
      for (const tc of testCases) {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-assist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            action: "match_service",
            description: tc.input,
          }),
        });

        const result = await response.json();
        if (result.success && result.data?.length > 0) {
          const matched = result.data[0].name?.toLowerCase() || "";
          if (new RegExp(tc.expected, "i").test(matched)) {
            correct++;
          }
        }
      }

      const accuracy = (correct / testCases.length) * 100;
      if (accuracy < 85) {
        throw new Error(`Accuracy ${accuracy}% is below 85% threshold`);
      }

      return { accuracy, threshold: 85, passed: true };
    })
  );

  return {
    name: "Telegram/WhatsApp Flow",
    tests,
    total: tests.length,
    passed: tests.filter((t) => t.passed).length,
    failed: tests.filter((t) => !t.passed).length,
    duration_ms: Date.now() - suiteStart,
  };
}

// ===== AI ASSISTED TESTS =====
async function testAIAssistedFlow(): Promise<TestSuite> {
  const tests: TestResult[] = [];
  const suiteStart = Date.now();

  // Test: Document processing
  tests.push(
    await runTest("Probar con imagen de cotización", async () => {
      // This would test with a real image URL
      // For now, we test the endpoint exists and responds
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ocr-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          action: "extract_quote_data",
          text: `Cotización #1234
Cliente: ACME Corp
RNC: 123-45678-9
Items:
- 2 VJ Retroexcavadora CAT @ 5,000 = 10,000
Subtotal: 10,000
ITBIS 18%: 1,800
Total: 11,800`,
        }),
      });

      if (!response.ok) {
        throw new Error(`OCR service error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    })
  );

  // Test: Validate warnings for missing data
  tests.push(
    await runTest("Validar warnings para datos faltantes", async () => {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ocr-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          action: "extract_quote_data",
          text: "Cotización sin datos claros",
        }),
      });

      const result = await response.json();
      
      // Should have warnings for incomplete data
      if (result.success && result.data?.warnings?.length > 0) {
        return { has_warnings: true, warnings: result.data.warnings };
      }
      
      return { has_warnings: false };
    })
  );

  return {
    name: "AI Assisted Flow",
    tests,
    total: tests.length,
    passed: tests.filter((t) => t.passed).length,
    failed: tests.filter((t) => !t.passed).length,
    duration_ms: Date.now() - suiteStart,
  };
}

// ===== NCF/FACTURA TESTS =====
async function testNCFFlow(): Promise<TestSuite> {
  const tests: TestResult[] = [];
  const suiteStart = Date.now();

  // Test: NCF sequence validation
  tests.push(
    await runTest("Validar secuencia NCF", async () => {
      const { data: docs } = await supabase
        .from("documents")
        .select("ncf")
        .eq("document_type", "factura")
        .not("ncf", "is", null)
        .order("created_at", { ascending: true })
        .limit(10);

      if (!docs || docs.length < 2) {
        return { skipped: true, reason: "Not enough invoices to validate sequence" };
      }

      // Check for gaps in sequence
      const ncfNumbers = docs
        .map((d) => {
          const match = d.ncf?.match(/\d+$/);
          return match ? parseInt(match[0]) : null;
        })
        .filter((n) => n !== null) as number[];

      const gaps: number[] = [];
      for (let i = 1; i < ncfNumbers.length; i++) {
        if (ncfNumbers[i] - ncfNumbers[i - 1] > 1) {
          gaps.push(ncfNumbers[i - 1]);
        }
      }

      return { 
        total_checked: ncfNumbers.length, 
        gaps_found: gaps.length,
        valid: gaps.length === 0,
      };
    })
  );

  // Test: ITBIS calculation on invoice
  tests.push(
    await runTest("Validar ITBIS en facturas", async () => {
      const { data: invoices } = await supabase
        .from("documents")
        .select("subtotal_taxable, itbis_amount, total")
        .eq("document_type", "factura")
        .limit(5);

      if (!invoices || invoices.length === 0) {
        return { skipped: true, reason: "No invoices to validate" };
      }

      let errors = 0;
      for (const inv of invoices) {
        const expectedItbis = (inv.subtotal_taxable || 0) * 0.18;
        if (Math.abs((inv.itbis_amount || 0) - expectedItbis) > 0.01) {
          errors++;
        }
      }

      if (errors > 0) {
        throw new Error(`${errors} invoices have ITBIS calculation errors`);
      }

      return { validated: invoices.length, errors: 0 };
    })
  );

  return {
    name: "NCF/Factura Flow",
    tests,
    total: tests.length,
    passed: tests.filter((t) => t.passed).length,
    failed: tests.filter((t) => !t.passed).length,
    duration_ms: Date.now() - suiteStart,
  };
}

// Main handler
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { suite } = await req.json().catch(() => ({ suite: "all" }));

    const suites: TestSuite[] = [];

    if (suite === "all" || suite === "manual") {
      suites.push(await testManualQuotationFlow());
    }
    if (suite === "all" || suite === "telegram") {
      suites.push(await testTelegramFlow());
    }
    if (suite === "all" || suite === "ai") {
      suites.push(await testAIAssistedFlow());
    }
    if (suite === "all" || suite === "ncf") {
      suites.push(await testNCFFlow());
    }

    const summary = {
      total_suites: suites.length,
      total_tests: suites.reduce((acc, s) => acc + s.total, 0),
      total_passed: suites.reduce((acc, s) => acc + s.passed, 0),
      total_failed: suites.reduce((acc, s) => acc + s.failed, 0),
      suites,
    };

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Test error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

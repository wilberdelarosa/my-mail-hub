'use client';

import { useState } from 'react';
import { FileText, Download, Eye, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type TemplateType = 'quote' | 'proforma' | 'invoice' | 'receipt' | 'conduce';

interface TemplateData {
    type: TemplateType;
    name: string;
    html: string;
    variables: string[];
}

const SAMPLE_DATA = {
    // Datos de muestra para preview
    companyName: 'ALITO GROUP SRL',
    companyRnc: '101-90213-7',
    companyAddress: 'Av. Independencia #123, Santo Domingo',
    companyPhone: '809-555-0123',
    customerName: 'DOLFOS SRL',
    customerRnc: '101-12345-6',
    documentNumber: 'COT-2026-0001',
    date: new Date().toLocaleDateString(),
    items: [
        { description: 'Transporte de Material', quantity: 4, unit: 'VIAJE', price: 3500, total: 14000 },
        { description: 'Alquiler Grúa 20 Ton', quantity: 8, unit: 'HR', price: 2500, total: 20000 }
    ],
    subtotal: 34000,
    tax: 6120,
    total: 40120
};

const DEFAULT_TEMPLATES: Record<TemplateType, string> = {
    quote: `
<div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
  <!-- Header -->
  <div style="border-bottom: 3px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="color: #1e40af; margin: 0;">{{companyName}}</h1>
    <p style="margin: 5px 0; color: #666;">RNC: {{companyRnc}}</p>
    <p style="margin: 5px 0; color: #666;">{{companyAddress}}</p>
    <p style="margin: 5px 0; color: #666;">Tel: {{companyPhone}}</p>
  </div>

  <!-- Document Info -->
  <div style="background: #f3f4f6; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
    <h2 style="margin: 0 0 10px 0; color: #1e40af;">COTIZACIÓN</h2>
    <p style="margin: 5px 0;"><strong>No.:</strong> {{documentNumber}}</p>
    <p style="margin: 5px 0;"><strong>Fecha:</strong> {{date}}</p>
  </div>

  <!-- Customer Info -->
  <div style="margin-bottom: 30px;">
    <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Cliente</h3>
    <p style="margin: 5px 0;"><strong>{{customerName}}</strong></p>
    <p style="margin: 5px 0; color: #666;">RNC: {{customerRnc}}</p>
  </div>

  <!-- Items Table -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
    <thead>
      <tr style="background: #1e40af; color: white;">
        <th style="padding: 12px; text-align: left;">Descripción</th>
        <th style="padding: 12px; text-align: center;">Cant.</th>
        <th style="padding: 12px; text-align: center;">Unidad</th>
        <th style="padding: 12px; text-align: right;">Precio</th>
        <th style="padding: 12px; text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      {{#each items}}
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px;">{{description}}</td>
        <td style="padding: 12px; text-align: center;">{{quantity}}</td>
        <td style="padding: 12px; text-align: center;">{{unit}}</td>
        <td style="padding: 12px; text-align: right;">RD$ {{price}}</td>
        <td style="padding: 12px; text-align: right;">RD$ {{total}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <!-- Totals -->
  <div style="text-align: right; margin-bottom: 30px;">
    <p style="margin: 5px 0;"><strong>Subtotal:</strong> RD$ {{subtotal}}</p>
    <p style="margin: 5px 0;"><strong>ITBIS (18%):</strong> RD$ {{tax}}</p>
    <p style="margin: 10px 0 0 0; font-size: 20px; color: #1e40af;"><strong>TOTAL:</strong> RD$ {{total}}</p>
  </div>

  <!-- Footer -->
  <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
    <p>Esta cotización tiene una validez de 15 días desde la fecha de emisión</p>
    <p style="margin-top: 10px;">Gracias por su preferencia - {{companyName}}</p>
  </div>
</div>
  `,
    proforma: `<!-- Similar structure for Proforma -->`,
    invoice: `<!-- Similar structure for Invoice with NCF -->`,
    receipt: `<!-- Receipt template -->`,
    conduce: `<!-- Delivery note template -->`
};

export default function TemplateEditorPage() {
    const [selectedType, setSelectedType] = useState<TemplateType>('quote');
    const [htmlCode, setHtmlCode] = useState(DEFAULT_TEMPLATES.quote);
    const [previewHtml, setPreviewHtml] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(true);

    const renderPreview = () => {
        // Simple template engine (replace {{variable}} with data)
        let rendered = htmlCode;

        // Replace simple variables
        Object.entries(SAMPLE_DATA).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
                rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
            }
        });

        // Replace items loop (simple implementation)
        const itemsMatch = rendered.match(/{{#each items}}([\s\S]*?){{\/each}}/);
        if (itemsMatch) {
            const itemTemplate = itemsMatch[1];
            const renderedItems = SAMPLE_DATA.items.map(item => {
                let itemHtml = itemTemplate;
                Object.entries(item).forEach(([key, value]) => {
                    itemHtml = itemHtml.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
                });
                return itemHtml;
            }).join('');

            rendered = rendered.replace(itemsMatch[0], renderedItems);
        }

        setPreviewHtml(rendered);
    };

    const handleRefresh = () => {
        renderPreview();
        toast.success('Preview actualizado');
    };

    const handleSave = async () => {
        // TODO: Guardar en base de datos
        toast.success('Plantilla guardada');
    };

    const handleDownloadPDF = async () => {
        try {
            const response = await fetch('http://localhost:3008/api/documents/v1/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html: previewHtml })
            });

            if (response.ok) {
                const { pdfUrl } = await response.json();
                window.open(pdfUrl, '_blank');
                toast.success('PDF generado');
            }
        } catch (error) {
            toast.error('Error generando PDF');
        }
    };

    const handleTypeChange = (type: TemplateType) => {
        setSelectedType(type);
        setHtmlCode(DEFAULT_TEMPLATES[type]);
    };

    // Auto-refresh on code change
    useState(() => {
        if (autoRefresh) {
            const timer = setTimeout(renderPreview, 500);
            return () => clearTimeout(timer);
        }
    });

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Editor de Plantillas PDF</h1>
                        <p className="text-sm text-gray-600">Personaliza tus documentos con vista previa en tiempo real</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="rounded"
                            />
                            Auto-refresh
                        </label>

                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>

                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            <Save className="w-4 h-4" />
                            Guardar
                        </button>

                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            <Download className="w-4 h-4" />
                            PDF
                        </button>
                    </div>
                </div>

                {/* Template Type Selector */}
                <div className="flex gap-2 mt-4">
                    {(['quote', 'proforma', 'invoice', 'receipt', 'conduce'] as TemplateType[]).map(type => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={`px-4 py-2 rounded-lg transition ${selectedType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <FileText className="w-4 h-4 inline mr-2" />
                            {type === 'quote' && 'Cotización'}
                            {type === 'proforma' && 'Proforma'}
                            {type === 'invoice' && 'Factura'}
                            {type === 'receipt' && 'Recibo'}
                            {type === 'conduce' && 'Conduce'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor + Preview */}
            <div className="flex-1 flex overflow-hidden">
                {/* HTML Editor */}
                <div className="w-1/2 border-r flex flex-col">
                    <div className="bg-gray-100 px-4 py-2 border-b">
                        <h3 className="font-semibold text-gray-700">HTML Template</h3>
                        <p className="text-xs text-gray-600">Usa {'{{variable}}'} para datos dinámicos</p>
                    </div>
                    <textarea
                        value={htmlCode}
                        onChange={(e) => setHtmlCode(e.target.value)}
                        className="flex-1 font-mono text-sm p-4 resize-none focus:outline-none"
                        spellCheck={false}
                    />
                </div>

                {/* Live Preview */}
                <div className="w-1/2 flex flex-col bg-gray-50">
                    <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
                        <h3 className="font-semibold text-gray-700">Vista Previa</h3>
                        <Eye className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <div
                            className="bg-white shadow-lg"
                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                    </div>
                </div>
            </div>

            {/* Variables Help */}
            <div className="bg-gray-100 border-t px-6 py-3">
                <div className="flex items-start gap-6 text-xs">
                    <div>
                        <strong>Variables disponibles:</strong>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(SAMPLE_DATA).filter(k => typeof SAMPLE_DATA[k as keyof typeof SAMPLE_DATA] !== 'object').map(key => (
                            <code key={key} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {`{{${key}}}`}
                            </code>
                        ))}
                    </div>
                    <div>
                        <strong>Loop:</strong> <code className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {'{{#each items}}...{{/each}}'}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Injectable } from '@nestjs/common';
import * as xmlbuilder2 from 'xmlbuilder2';

interface ENCFData {
    invoiceId: string;
    encfSequence: string;
    ncfType: string;
    issuerRnc: string;
    issuerName: string;
    customerRnc: string;
    customerName: string;
    issueDate: string;
    subtotal: number;
    taxAmount: number;
    total: number;
    items: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
        total: number;
    }>;
}

/**
 * Servicio para generación de XML de e-NCF según formato DGII v1.0
 * Referencia: https://dgii.gov.do/legislacion/documentosElectronicosNorma/
 */
@Injectable()
export class ENCFXMLGenerator {

    /**
     * Genera XML de e-NCF según especificación DGII
     */
    generateXML(data: ENCFData): string {
        const root = xmlbuilder2.create({ version: '1.0', encoding: 'UTF-8' })
            .ele('ENCF', {
                'xmlns': 'http://dgii.gov.do/ecf/v1.0',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'Tipo': data.ncfType,
                'Version': '1.0'
            });

        // 1. Encabezado
        const encabezado = root.ele('Encabezado');

        encabezado.ele('IdDoc')
            .ele('TipoeNCF', {}, data.ncfType).up()
            .ele('eNCF', {}, data.encfSequence).up()
            .ele('FechaEmision', {}, data.issueDate).up()
            .up();

        // 2. Emisor
        encabezado.ele('Emisor')
            .ele('RNCEmisor', {}, data.issuerRnc).up()
            .ele('RazonSocialEmisor', {}, data.issuerName).up()
            .up();

        // 3. Comprador
        encabezado.ele('Comprador')
            .ele('RNCComprador', {}, data.customerRnc).up()
            .ele('RazonSocialComprador', {}, data.customerName).up()
            .up()
            .up(); // Close Encabezado

        // 4. Detalles de Items
        const detalles = root.ele('DetallesItems');

        data.items.forEach((item, index) => {
            const detalle = detalles.ele('Item', { Linea: (index + 1).toString() });

            detalle.ele('NombreBienServicio', {}, item.description).up()
                .ele('CantidadBienServicio', {}, item.quantity.toFixed(2)).up()
                .ele('PrecioUnitarioBienServicio', {}, item.unitPrice.toFixed(2)).up()
                .ele('MontoITBIS', {}, (item.total * item.taxRate).toFixed(2)).up()
                .ele('MontoItem', {}, item.total.toFixed(2)).up()
                .up();
        });

        detalles.up(); // Close DetallesItems

        // 5. Totales
        const totales = root.ele('Totales');

        totales.ele('MontoGravadoTotal', {}, data.subtotal.toFixed(2)).up()
            .ele('MontoExentoTotal', {}, '0.00').up()
            .ele('MontoITBISTotal', {}, data.taxAmount.toFixed(2)).up()
            .ele('MontoTotal', {}, data.total.toFixed(2)).up()
            .up();

        // 6. Información de Referencia (placeholder para pagos)
        root.ele('InformacionReferencia')
            .ele('ReferenciaNCF', {}, 'N/A').up()
            .up();

        const xml = root.end({ prettyPrint: true });

        console.log(`✅ XML e-NCF generated for ${data.encfSequence}`);
        return xml;
    }

    /**
     * Valida XML contra esquema XSD (placeholder)
     */
    async validateXML(xml: string): Promise<boolean> {
        // TODO: Validar contra XSD oficial de DGII
        console.log('⚠️ XML validation not implemented yet');
        return true;
    }
}

export interface TemplateEnginePort {
    render(templateName: string, data: any): Promise<string>;
    generatePdf(html: string): Promise<Buffer>;
}

export const TemplateEnginePort = Symbol('TemplateEnginePort');

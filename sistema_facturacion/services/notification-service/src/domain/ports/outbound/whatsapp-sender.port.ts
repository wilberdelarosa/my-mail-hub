export interface WhatsAppSenderPort {
    sendWhatsApp(to: string, message: string): Promise<void>;
}

export const WhatsAppSenderPort = Symbol('WhatsAppSenderPort');

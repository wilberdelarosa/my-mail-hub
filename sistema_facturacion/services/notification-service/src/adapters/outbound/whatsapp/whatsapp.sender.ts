import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsAppSender {
    private readonly logger = new Logger(WhatsAppSender.name);

    async sendMessage(phone: string, text: string): Promise<void> {
        // Aquí iría la integración real con Twilio o Meta Cloud API
        this.logger.log(`[WHATSAPP] Sending to ${phone}: ${text}`);
        // Simulate latency
        await new Promise(r => setTimeout(r, 200));
        this.logger.log(`[WHATSAPP] Sent successfully`);
    }
}

import { Injectable, Logger } from '@nestjs/common';
import { EmailSenderPort } from '../../../domain/ports/outbound/email-sender.port';

@Injectable()
export class MailpitEmailSender implements EmailSenderPort {
    private readonly logger = new Logger(MailpitEmailSender.name);

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        // En producción usaríamos nodemailer conectado a SMTP
        // Aquí simulamos el envío a Mailpit (que corre en Docker)
        this.logger.log(`[MAILPIT] Sending email to: ${to}`);
        this.logger.log(`[MAILPIT] Subject: ${subject}`);
        // this.logger.debug(`[MAILPIT] Body: ${body}`);

        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 500));

        this.logger.log(`[MAILPIT] Email sent successfully`);
    }
}

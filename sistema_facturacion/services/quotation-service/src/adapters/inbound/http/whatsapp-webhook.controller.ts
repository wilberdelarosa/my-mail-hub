import { Controller, Post, Get, Body, Query, Res, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

import { ProcessWhatsAppMessageUseCase } from '../../../application/use-cases/process-whatsapp-message.usecase';

@Controller('webhook/whatsapp')
export class WhatsAppWebhookController {

    constructor(private readonly processWhatsAppMessageUseCase: ProcessWhatsAppMessageUseCase) { }

    // 1. Verificación del Webhook (Requerido por Meta)
    @Get()
    verifyWebhook(@Query('hub.mode') mode: string,
        @Query('hub.verify_token') token: string,
        @Query('hub.challenge') challenge: string,
        @Res() res: Response) {

        const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('✅ WhatsApp Webhook Verified!');
                return res.status(HttpStatus.OK).send(challenge);
            } else {
                return res.sendStatus(HttpStatus.FORBIDDEN);
            }
        }
        return res.sendStatus(HttpStatus.BAD_REQUEST);
    }

    // 2. Recepción de Mensajes
    @Post()
    async receiveMessage(@Body() body: any, @Res() res: Response) {
        console.log('📨 WhatsApp Payload:', JSON.stringify(body, null, 2));

        // Validación básica de estructura Meta
        if (body.object === 'whatsapp_business_account') {
            if (body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0] &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const message = body.entry[0].changes[0].value.messages[0];
                const from = message.from;
                const text = message.text ? message.text.body : '[Media/Other]';

                console.log(`💬 Message from ${from}: ${text}`);

                // Aquí llamaremos al UseCase para procesar el mensaje
                await this.processWhatsAppMessageUseCase.execute({ from, text, timestamp: new Date().toISOString() });
            }
            return res.status(HttpStatus.OK).send('EVENT_RECEIVED');
        }

        return res.sendStatus(HttpStatus.NOT_FOUND);
    }
}

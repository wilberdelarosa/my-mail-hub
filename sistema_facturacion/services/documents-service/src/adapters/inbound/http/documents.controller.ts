import { Controller, Post, Body } from '@nestjs/common';
import { GenerateDocumentUseCase, GenerateDocumentCommand } from '../../../application/use-cases/generate-document.usecase';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly generateUseCase: GenerateDocumentUseCase) { }

    @Post('generate')
    async generate(@Body() command: GenerateDocumentCommand) {
        const url = await this.generateUseCase.execute(command);
        return { success: true, url };
    }
}

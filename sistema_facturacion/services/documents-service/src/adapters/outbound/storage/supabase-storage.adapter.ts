import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FileStoragePort } from '../../../domain/ports/outbound/file-storage.port';

@Injectable()
export class SupabaseStorageAdapter implements FileStoragePort {
    private supabase: SupabaseClient;
    private readonly bucketName = 'documents';

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_SERVICE_KEY || ''
        );
    }

    async upload(fileName: string, buffer: Buffer): Promise<string> {
        const { data, error } = await this.supabase
            .storage
            .from(this.bucketName)
            .upload(fileName, buffer, {
                contentType: 'application/pdf',
                upsert: true
            });

        if (error) throw new Error(`Supabase upload failed: ${error.message}`);
        return data.path;
    }

    async delete(fileName: string): Promise<void> {
        await this.supabase.storage.from(this.bucketName).remove([fileName]);
    }

    async getSignedUrl(fileName: string): Promise<string> {
        const { data, error } = await this.supabase
            .storage
            .from(this.bucketName)
            .createSignedUrl(fileName, 3600); // 1 hour

        if (error) throw new Error(`Error getting signed URL: ${error.message}`);
        return data.signedUrl;
    }
}

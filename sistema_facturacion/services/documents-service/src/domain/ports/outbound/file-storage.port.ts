export interface FileStoragePort {
    upload(fileName: string, buffer: Buffer): Promise<string>;
    delete(fileName: string): Promise<void>;
    getSignedUrl(fileName: string): Promise<string>;
}

export const FileStoragePort = Symbol('FileStoragePort');

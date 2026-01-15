import { createHash } from 'crypto';

export function sha256(input: unknown): string {
    const payload = typeof input === 'string' ? input : JSON.stringify(input);
    return createHash('sha256').update(payload).digest('hex');
}

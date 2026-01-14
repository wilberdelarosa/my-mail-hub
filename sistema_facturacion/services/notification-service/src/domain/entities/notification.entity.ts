export enum NotificationType {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    WHATSAPP = 'WHATSAPP'
}

export enum NotificationStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    FAILED = 'FAILED'
}

export class Notification {
    constructor(
        public readonly id: string,
        public readonly type: NotificationType,
        public readonly recipient: string,
        public readonly subject: string,
        public readonly body: string,
        public status: NotificationStatus,
        public readonly createdAt: Date,
        public sentAt?: Date,
        public error?: string
    ) { }

    markAsSent(): void {
        this.status = NotificationStatus.SENT;
        this.sentAt = new Date();
    }

    markAsFailed(error: string): void {
        this.status = NotificationStatus.FAILED;
        this.error = error;
    }
}

import { Notification } from '../../entities/notification.entity';

export interface NotificationRepositoryPort {
    save(notification: Notification): Promise<void>;
}

export const NotificationRepositoryPort = Symbol('NotificationRepositoryPort');

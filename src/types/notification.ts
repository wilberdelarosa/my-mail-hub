export interface Notification {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  content: string;
  date: Date;
  read: boolean;
  starred: boolean;
  category: 'primary' | 'social' | 'promotions' | 'updates';
  attachments?: string[];
}

export type NotificationFilter = 'all' | 'unread' | 'starred' | 'primary' | 'social' | 'promotions' | 'updates';

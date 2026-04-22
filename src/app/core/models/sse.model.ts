export interface SseNotification {
  message: string;
  type: 'SENT_UPDATE' | 'RECEIVED';
  data?: string;
}
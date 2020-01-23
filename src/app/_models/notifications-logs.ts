import {SentNotifications} from "./notification";

export class NotificationsLogs {
    id: string;
    date: string;
    todays_attempts: number;
    sent_notifications: SentNotifications[];
}

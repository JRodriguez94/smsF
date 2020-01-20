export class Notification {
    telefono: string;
    mensaje: string;
    sentTime?: string;
    id?: number;
    wasSent: boolean;
}


export class SentNotifications {
    id_sent: string;
    elements: number;
    starts_at: string;
    ends_at: string;
    notifications: Notification[]
}

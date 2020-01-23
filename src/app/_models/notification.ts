export class Notification {
    telefono: string;
    mensaje: string;
    sentTime?: string;
    id?: number;
    wasSent: boolean;
}


export class SentNotifications {
    elements: number;
    starts_at: string;
    ends_at: string;
    notifications: Notification[];
}

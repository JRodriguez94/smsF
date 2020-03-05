export class Notification {
    telefono: string;
    mensaje: string;
    sentTime?: string;
    id?: number;
    wasSent: boolean;
}


/**
 * @author: Otniel Munoz <otniel.diazescobarmunoz@gmail.com>
 * @param: null
 * @return: null
 * @description: Se valida el formulario si es valido, la informacion del formulario se pasa a otro objeto para
 * darle formato al atributo tiempo y ese se manda al API junto con un mensaje del servicio sweet alert 2
 * */
export class SentNotifications {
    elements: number;
    starts_at: string;
    ends_at: string;
    notifications: Notification[];
}

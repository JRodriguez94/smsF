import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import { Notification } from "../_models/notification";
import {NotificationReq} from "../_models/notification-req";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor( private http: HttpClient ) { }

  /*
* @author: Josue Rodriguez <josue@Fiducia.com.mx>
* @inputs: none
* @output: promise
* @description: Ejecuta el metodo get() de http y restorna el resultado
* de la peticion al API.
* */
  getNotifications(){
    return this.http.get<response>('https://api.fiducia.com.mx/test/sms/');
    /*this.http.get<response>('https://api.fiducia.com.mx/test/sms/').subscribe(response => {
      console.log('response desdel servicio: ', response.response);
    })*/
  }

  /*
* ================== PENDIENTE =================
* @author: Josue Rodriguez <josue@Fiducia.com.mx>
* @inputs: notificationReq: NotificationReq
* @output: promise
* @description: Esta función retorna el resultado dle emtodo get() de http
* que es lanzada con los parametros de entrada que llegan como un objeto notificationRep.
* */
  getNotificationsByParams(notificationReq: NotificationReq) {
    // console.log('Estos son los parametros que llegan al Req: ', notificationReq)
    return this.http.get<response>('https://api.fiducia.com.mx/test/sms/');
  }

}

class response {
  elapsed: string;
  response: Notification[];
}

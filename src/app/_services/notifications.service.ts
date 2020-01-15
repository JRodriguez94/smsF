import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import { Notification } from "../_models/notification";
import {NotificationReq} from "../_models/notification-req";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor( private http: HttpClient ) { }

  getNotifications(){
    return this.http.get<response>('https://api.fiducia.com.mx/test/sms/');
    /*this.http.get<response>('https://api.fiducia.com.mx/test/sms/').subscribe(response => {
      console.log('response desdel servicio: ', response.response);
    })*/
  }


  getNotificationsByParams(notificationReq: NotificationReq) {
    // console.log('Estos son los parametros que llegan al Req: ', notificationReq)
    return this.http.get<response>('https://api.fiducia.com.mx/test/sms/');
  }

}

class response {
  elapsed: string;
  response: Notification[];
}

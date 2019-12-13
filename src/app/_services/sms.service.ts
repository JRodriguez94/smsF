import { Injectable } from '@angular/core';
import {SMS} from "@ionic-native/sms/ngx";

import { Notification } from "../_models/notification";

@Injectable({
  providedIn: 'root'
})
export class SmsService {


  logsAr: notificationL[] = [];

  constructor(private sms: SMS) { }


  sendSMS(number: string, message: string) {
    return this.sms.send(number, message);
  }

   sendMultiSMS(notifications: Notification[]): notificationL[] {

    let nNot = 0;
    notifications.forEach(async (notification, i) => {
      setTimeout(() => {
        console.log('Notificacion desde SMSService desde el setTimeOut: ', notification);
        // console.log('Notificacion: '+  nNot +' desde el setTimeOut')
      }, i * 2000);
      nNot+=1;
    });

    console.log('Ya pasó el foreach');
    return this.logsAr;
  }


}


class notificationL {
  number: string;
  message: string;
  time: string;
  status: string;
}

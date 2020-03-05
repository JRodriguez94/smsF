import { Injectable } from '@angular/core';
import {SMS} from "@ionic-native/sms/ngx";

import { Notification } from "../_models/notification";
import {UtilitiesService} from "./utilities.service";

@Injectable({
  providedIn: 'root'
})
export class SmsService {


  // logsAr: notificationL[] = [];

  constructor(
      private sms: SMS,
      private utilitiesService: UtilitiesService
  ) { }

  /*
   * @author: Josue Rodriguez
   * @parameters: number: string, message: string
   * @returns: Promise: promise
   * @Description: Envia un mensaje de texto con los datos
   * que llegan como paraetros (number, message) y devuelve
   * una promesa.
   * */
  sendSMS(number: string, message: string) {
    return this.sms.send(number, message);
  }

  /*
  * @author: Josue Rodriguez
  * @parameters: number: string, message: string
  * @returns: Promise: boolean
  * @Description: Envia mensajes de texto al numero que lega como parametro,
  * así como se usa el message como cuerpo del mensaje.
  * Esto se hace de forma asincrona con un interbalo de tiempo de 5 a 16 segundos
  * entre cada intento de envio.
  * Finalmente retorna un valor booleano como parte de la promesa, dependiendo
  * si el mensaje fue enviado con exito o no.
  * */
  async sendSMSasync(number: string, message: string): Promise<boolean> {

      // console.time('loop');
      let time: number = this.utilitiesService.randomSetTimeValue(5,16);
      let resolveFunction: (wasSent: boolean) => void;
      const promise = new Promise<boolean>(resolve => {
         resolveFunction = resolve;
      });

      setTimeout(async () => {
      const sms = await this.sendSMS(number, message).then(() => {
          resolveFunction(true);
      }).catch(() => {
          resolveFunction(false)
      });
      // console.timeEnd('loop');

      }, time);
      return promise;
  }



   /*sendMultiSMS(notifications: Notification[]): notificationL[] {

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
  }*/


}


/*class notificationL {
  number: string;
  message: string;
  time: string;
  status: string;
}*/

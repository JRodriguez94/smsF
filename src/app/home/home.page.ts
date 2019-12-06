import { Component } from '@angular/core';
import { SMS } from '@ionic-native/sms/ngx';
import {NotificationsService} from "../_services/notifications.service";

import {Notification} from "../_models/notification";
import { AlertController } from '@ionic/angular';

import { NotificacionesProvider } from "../_providers/notificaciones";

import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  notifications: Notification[] = [];

  sent_successfully_notifications: Notification[] = [];
  not_set_notifications: Notification[] = [];

  sent_successfully_notifications2: any;
  not_set_notifications2: any;

  constructor(
      private sms: SMS,
      private alertController: AlertController,
      private notificationsService: NotificationsService,
      private notificacionesProvider: NotificacionesProvider,
      ) {
  /*  console.log('Moment(?', moment().format('LT'));
    this.sent_successfully_notifications2 = this.notificacionesProvider.sent;
    this.not_set_notifications2 = this.notificacionesProvider.notSent;*/
  }


  getNotifications(){
    this.notificationsService.getNotifications().subscribe(response => {
      this.notifications = response.response;
      this.sentNotificationsAlert(this.notifications.length);
      // console.log('Notifications: (? ', response.response );
      // console.log('Este es el array de notifications: ', this.notifications );
    })
  }


  sendNotifications(notifications: Notification[]) {
    console.log('array de notificaciones desde sendNotifications:', notifications);
    let index = 0;
    notifications.forEach(notification => {
     /* console.log('Notificación; '+index, notification);
      console.log('Numero de la notifiación: ', notification.telefono);
      console.log('Mensaje de la notifiación: ', notification.mensaje);*/

      this.sendSMS(notification.telefono, notification.mensaje).then(()=> {

        console.log('se ha enviado el mensaje: '+index);

        notification.sentTime = moment().format('LT');

        this.sent_successfully_notifications.push(notification);
      }).catch(()=> {
        console.log('Fallo el envio del mensaje: '+index);
        this.not_set_notifications.push(notification);
      });
      index+=1;
    });
    console.log('Notificaciones enviadas: ', this.sent_successfully_notifications);
  }

  sendSMS(number: string, message: string) {
    return this.sms.send(number, message);
  }


  async presentSimpleAlert(header: string, subheader: string, messaje: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: messaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  async sentNotificationsAlert(notifications_number: number) {
    const alert = await this.alertController.create({
      header: 'Eviar notifiaciones',
      subHeader: 'Estan por enviarse '+notifications_number+' notificaciones,',
      message: 'estas seguro de esto?',
      buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Ok',
            handler: () => {
              this.sendNotifications(this.notifications);
            }
          }
        ]
    });

    await alert.present();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Mensaje de prueba',
      inputs: [
        {
          name: 'number',
          type: 'text',
          id: 'number-id',
          placeholder: 'Numero'
        },
        {
          name: 'message',
          type: 'text',
          id: 'message-id',
          placeholder: 'Mensaje'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Enviar',
          handler: data => {
            console.log('data: ', data);
            if ( this.validateTestSMSPrompt(data.number, data.message) ) {
              this.sendSMS(data.number, data.message).then(()=> {
                this.presentSimpleAlert(
                  'Hecho',
                  '',
                  'El mensaje ha sido enviado',
                );
              }).catch( error => {
                this.presentSimpleAlert(
                    'Error',
                    'Ha ocurrido un error',
                    error,
                );
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  validateTestSMSPrompt(number: string, message: string): boolean {
    if (number != '' && message != '') {
      if (number.length === 10) {
        return true
      } else {
        this.presentSimpleAlert(
          'Error',
          'Upps..',
          'El numero debe contener 10 digitos'
        );
        return false
      }
    } else {
      this.presentSimpleAlert(
          'Error',
          'Upps..',
          'Los campos numero y mensaje son obligatorios'
      );
      return false
    }
  }

}

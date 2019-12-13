import { Component } from '@angular/core';
// import { SMS } from '@ionic-native/sms/ngx';
import {NotificationsService} from "../_services/notifications.service";

import {Notification} from "../_models/notification";
import { AlertController } from '@ionic/angular';

import { NotificacionesProvider } from "../_providers/notificaciones";

import * as moment from 'moment';
import {SmsService} from "../_services/sms.service";

import {Router, NavigationExtras} from "@angular/router";

import {Observable} from 'rxjs';
import {AlertsService} from "../_services/alerts.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  notifications: Notification[] = [];

  sent_successfully_notifications: Notification[] = [];
  not_set_notifications: Notification[] = [];


  // Variables temporales para pruebas
  sent_successfully_notifications2: any;
  not_set_notifications2: any;


  constructor(
      // private sms: SMS,
      private alertController: AlertController,
      private notificationsService: NotificationsService,
      private notificacionesProvider: NotificacionesProvider,
      private smsService: SmsService,
      private router: Router,
      private alertsService: AlertsService
      ) {
  /*  console.log('Moment(?', moment().format('LT'));
    this.sent_successfully_notifications2 = this.notificacionesProvider.sent;
    this.not_set_notifications2 = this.notificacionesProvider.notSent;*/

    // this.to_send_notifications = this.notificacionesProvider.toSend;
  }

  sendAllNotifications(){
    this.notificationsService.getNotifications().subscribe(response => {
      this.notifications = response.response;
      this.sentNotificationsAlert(this.notifications.length);
    });
  }

  goToSelectN(){
    console.log('Entró a la funcion goToSelectN()');

    this.notificationsService.getNotifications().subscribe(notifications => {

      // *************************************
      let index_id = 0;
      notifications.response.forEach(notification => {
        notification.id = index_id;
        index_id += 1;
      });
      // *************************************


      let navigationExtras: NavigationExtras = {
        state: {
          notifications: notifications.response
        }
      };

      console.log('Estas son las notificaciones; ', notifications.response);

      this.router.navigate(['home/selectn'], navigationExtras);
    });
  }


  sendNotifications(notifications: Notification[]) {
    console.log('array de notificaciones desde sendNotifications:', notifications);
    let index = 0;

    notifications.forEach((notification, i) => {

      setTimeout(()=> { // UP.1

        this.smsService.sendSMS(notification.telefono, notification.mensaje).then( backlog => {

          console.log('se ha enviado el mensaje: '+index + ' backLog: ', backlog);

          notification.sentTime = moment().format('LT');

          this.sent_successfully_notifications.push(notification);
        }).catch(error => {
          console.log('Fallo el envio del mensaje: '+index + ' Error: ', error);
          this.not_set_notifications.push(notification);
        });

      }, i * 2000);  // UP.1

      index+=1;
    });

    console.log('Notificaciones enviadas: ', this.sent_successfully_notifications);
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
              this.smsService.sendSMS(data.number, data.message).then(()=> {
                this.alertsService.presentSimpleAlert(
                  'Hecho',
                  '',
                  'El mensaje ha sido enviado',
                );
              }).catch( error => {
                this.alertsService.presentSimpleAlert(
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
        this.alertsService.presentSimpleAlert(
          'Error',
          'Upps..',
          'El numero debe contener 10 digitos'
        );
        return false
      }
    } else {
      this.alertsService.presentSimpleAlert(
          'Error',
          'Upps..',
          'Los campos numero y mensaje son obligatorios'
      );
      return false
    }
  }

}

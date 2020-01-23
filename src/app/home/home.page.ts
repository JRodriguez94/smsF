import { Component } from '@angular/core';
// import { SMS } from '@ionic-native/sms/ngx';
import {NotificationsService} from "../_services/notifications.service";

import {Notification} from "../_models/notification";
import { AlertController } from '@ionic/angular';

import { NotificacionesProvider } from "../_providers/notificaciones";

import * as moment from 'moment';
import {SmsService} from "../_services/sms.service";

import {Router, NavigationExtras} from "@angular/router";

import {AlertsService} from "../_services/alerts.service";

import { ModalController } from "@ionic/angular";
import {ModalService} from "../_services/modal.service";
import {UtilitiesService} from "../_services/utilities.service";

import { LoadingController } from '@ionic/angular';
import {LogsService} from "../_services/logs.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  notifications: Notification[] = [];

  sent_successfully_notifications: Notification[] = [];
  not_set_notifications: Notification[] = [];


  loading: any = null;


 /* // Variables temporales para pruebas
  sent_successfully_notifications2: any;
  not_set_notifications2: any;

// se va a borrar o sustituir
  dataReturned:any;

  modalNotifications: any;*/


  constructor(
      // private sms: SMS,
      private alertController: AlertController,
      private notificationsService: NotificationsService,
      private notificacionesProvider: NotificacionesProvider,
      private smsService: SmsService,
      private router: Router,
      private alertsService: AlertsService,
      private modalService: ModalService,
      private utilitiesService: UtilitiesService,
      public loadingController: LoadingController,
      private logsService: LogsService,
      ) {
  /*  console.log('Moment(?', moment().format('LT'));
    this.sent_successfully_notifications2 = this.notificacionesProvider.sent;
    this.not_set_notifications2 = this.notificacionesProvider.notSent;*/

    // this.to_send_notifications = this.notificacionesProvider.toSend;
  }

  /**
   *  @Author: Josue Rodriguez | Josue@Fiducia.com.mx
   *  @Parameters: null
   *  @Returns: null
   *  @Description: Esta función manda manda a llamar el metodo getNotifications del servicio notificationsService
   *  para obtener todas las notificaciones disponibles mediante el API. Despues de obtenerlas, este objeto se almacena en this.notifications
   *  para sacar el valor .length y ser utilizado como parametro en el metodo sentNotificationsAlert.
   **/
  sendAllNotifications(){
    this.notificationsService.getNotifications().subscribe(response => {
      this.notifications = response.response;
      this.sentNotificationsAlert(this.notifications.length);
    });
  }

  /**
   *  @Author: Josue Rodriguez | Josue@Fiducia.com.mx
   *  @Parameters: null
   *  @Returns: null
   *  @Description: Esta función obtiene las notificaciones mediante el metodo getNotification. Al ser esta ultima funcion un obserbable,
   *  como respuesta retorna un objeto notifications, este objeto notifications contiene un array de notificaciones sin ID (por ahora)
   *  el siguiete paso, es iterar el objeto notificaciones, y asignarle un ID a cada elemento para poder hacer referencia a este, para eso
   *  se utiliza un foreach en el objeto notifications.
   *  Despues, se hace uso del recurso NavigationExtras de Angular Router para declarar un parametro de redirecionamiento, asignando a este el objeto
   *  notifications. Finalmente, se hace el redireccionamiento al con router.navigate al recurso home/selectn con navigationExtras como parametro.
   **/
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

  /**
   *  @Author: Josue Rodriguez | Josue@Fiducia.com.mx
   *  @Parameters: notifications: Notifications[]
   *  @Returns: null
   *  @Description: Esta funcion recibe como parametro un arreglo de notificaciones,
   *  aplica un foreach en este array y poc cada uno de los elementos, mediante un setTimeOut de 2 segundos,
   *  se manda a llamar la funcion sendSMS del servicio sms Service con el elemento que esta siendo i
   **/
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


  /**
   *  @Author: Josue Rodriguez | Josue@Fiducia.com.mx
   *  @Parameters: notifications_number: number
   *  @Returns: null
   *  @Description: Lanza un alert notificando al usuario que estan por ser enviadas
   *  las notificaciones.
   **/
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

  /**
   *  @Author: Josue Rodriguez | Josue@Fiducia.com.mx
   *  @Parameters: null
   *  @Returns: null
   *  @Description: Esta funcion lanza un pequeño form dentro de un aler donde se
   *  va a capturar un numero y un mensaje que sera enviado como un mensaje de prueba
   *  utilizando la funcion sendSMS del smsService.
   **/
  async sendSMSTest() {
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


  /**
   *  @Author: Josue Rodriguez | Josue@Fiducia.com.mx
   *  @Parameters: number: string, message: string
   *  @Returns: false
   *  @Description: Esta funcion es unicamente para validar de una
   *  forma simple el promp form de los sms de prueba. La validacion de
   *  este form sunicamente valida que el numero sea de diez digitos y que
   *  el mensaje no este vacio. De haber alguno de estos erroes, simplemente
   *  Precera un alert señalando el error.
   **/
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



  // TEMP TEST AREA


  async presentLoading() {
     this.loading = await this.loadingController.create({
      spinner: "circular",
      // duration: 5000,
      message: 'Enviando notificaciones..',
      translucent: true,
    });
    return await this.loading.present();
  }

  closseLoading() {
    this.loadingController.dismiss();
  }

  // TEMP TEST AREA


}

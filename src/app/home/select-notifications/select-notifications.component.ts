import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import { Notification } from "../../_models/notification";
import {SmsService} from "../../_services/sms.service";

import {AlertsService} from "../../_services/alerts.service";

import * as moment from 'moment';
import {AlertController} from "@ionic/angular";


@Component({
  selector: 'app-select-notifications',
  templateUrl: './select-notifications.component.html',
  styleUrls: ['./select-notifications.component.scss'],
})
export class SelectNotificationsComponent implements OnInit {

  notifications_for_checks: checks[] = [];

  notifications_to_send: Notification[] = [];

  sent_successfully_notifications: Notification[] = [];
  not_set_notifications: Notification[] = [];

  isAllSelected: boolean = false;


  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private smsService: SmsService,
      private alertsService: AlertsService,
      private alertController: AlertController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        let notifications_temp: Notification[] = this.router
            .getCurrentNavigation().extras.state.notifications;
              notifications_temp.forEach( notification => {
                let single_notification: checks = {
                  'notification' : notification,
                  'isChecked' : false
                };
                this.notifications_for_checks.push(single_notification);
              });
        console.log('Array de checks ', this.notifications_for_checks);
      }
    });
  }

  /*
  Nos quedamos aquí. El enviar los mensajes con un setTimeOut no funcionó por la asincronia de
  este metodo dentro del forEach. Se Sigue buscando una soluciín, pero por ahora, lo que hace
  esta función, es enviar las notificaciones con la velocidad normal de un ciclo for (forEach)
  y guardar las notificiones en los arrays correspondientes.
  Aun se necesita trabajar en eso y se va a hacer.
  Falta aun motrar el resultado sobre las notificaciones enviadas y no enviadas en el metodo.
  */
  async sendCheckNotifications() {

    this.notifications_to_send = [];
    this.notifications_for_checks.forEach( notification => {
      if(notification.isChecked === true ){
        this.notifications_to_send.push(notification.notification)
      }
    });

    if (this.notifications_to_send.length === 0 ) {
      this.alertsService.presentSimpleAlert(
        'Error',
        'Ups..',
        'Debes seleccionar por lo menos un elemento',
      );
      return
    }


    // Alert de confirmación -----------------------------------

    // console.log('Que se supone que retorna this.alertsService.confirmationAlert(): ', typeof this.alertsService.confirmationAlert);

    const confirmation = await this.alertsService.confirmationAlert(
        'Aviso',
        'Esas por enviars ' + this.notifications_to_send.length +' notificaciones, ¿Estas seguro de esto?'
    );

    if (!confirmation)
      return;

    // Alert de confirmación -----------------------------------


    // NOTA: APARTIR DE AQUI SE TIENE QUE MANEJAR DE FORMA DIFERENTE HACIENDO
    // UN OBSERVABLE O ALGO PARA QUE NOTIFIQUE CUANDO EL PROCESO HAYA TERMINADO


    let nNot = 0;

    for (const notification of this.notifications_to_send) {
      // setTimeout(async () => {

      console.time('loop');
      let wasSent = await this.smsService.sendSMSasync(notification.telefono, notification.mensaje);
      console.timeEnd('loop');
      if (wasSent) {
        console.log('Mensaje '+nNot+' fue enviado');
      } else {
        console.log('Mensaje '+nNot+' NO fue enviado');
      }
        /*await this.smsService.sendSMS(notification.telefono, notification.mensaje).then(response => {
          console.log('Se envió el mensaje: '+nNot + ' el codigo de success que arroja es este: ', response);
            notification.sentTime = moment().format('LT');
            this.sent_successfully_notifications.push(notification);
        }).catch(error => {
          console.log('No se envió el mensaje: '+ nNot + ' el error que da es el siguiente: ', error);
            notification.sentTime = moment().format('LT');
            this.not_set_notifications.push(notification);
        });
        nNot += 1;*/
      // }, 2000)
        nNot++;
    }

    console.log('En este punto ya debiern haberse enviado TODAS las notificaciones');

    console.log('Array de notificaciones enviadas: ', this.sent_successfully_notifications);
    console.log('Array de notificaciones NO enviadas: ', this.not_set_notifications);



    // console.log('Notificaciones para enviar: ', this.notifications_to_send);
  }


/* async sendNotificationsAsync() {
    let index = 0;
    await this.notifications_to_send.forEach((notification, i) => {
      // setTimeout(()=> {
        console.log('Se imprime la notificación: ', notification);


        this.smsService.sendSMS(notification.telefono, notification.mensaje).then( backlog => {

          console.log('se ha enviado el mensaje: '+index + ' backLog: ', backlog);

          notification.sentTime = moment().format('LT');

          this.sent_successfully_notifications.push(notification);
        }).catch(error => {
          console.log('Fallo el envio del mensaje: '+index + ' Error: ', error);
          this.not_set_notifications.push(notification);
        });

      // }, i * 2000);
      index+=1;
    });
  }*/



  selectAll($event) {
    console.log('Entrí a la función selectAll: ', $event);
    this.notifications_for_checks.forEach(notification => {
      // console.log('Notificacion: ', notification.isChecked);

      notification.isChecked = this.isAllSelected;

    });
  }




}

class checks {
  notification : Notification;
  isChecked : boolean;
}


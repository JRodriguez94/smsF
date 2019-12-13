import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import { Notification } from "../../_models/notification";
import {SmsService} from "../../_services/sms.service";

import {AlertsService} from "../../_services/alerts.service";

import * as moment from 'moment';


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


  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private smsService: SmsService,
      private alertsService: AlertsService
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

    let nNot = 0;

    for (const notification of this.notifications_to_send) {
      // setTimeout(async () => {
        await this.smsService.sendSMS(notification.telefono, notification.mensaje).then(response => {
          console.log('Se envió el mensaje: '+nNot + ' el codigo de success que arroja es este: ', response)
        }).catch(error => {
          console.log('No se envió el mensaje: '+ nNot + ' el error que da es el siguiente: ', error)
        });
        nNot += 1;
      // }, 2000)
    }

    console.log('En este punto ya debiern haberse enviado TODAS las notificaciones');

    /*console.log('Array de notificaciones enviadas: ', this.sent_successfully_notifications);
    console.log('Array de notificaciones NO enviadas: ', this.not_set_notifications);*/



    // console.log('Notificaciones para enviar: ', this.notifications_to_send);
  }


 async sendNotificationsAsync() {
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
  }




}

class checks {
  notification : Notification;
  isChecked : boolean;
}


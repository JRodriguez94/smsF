import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {Notification, SentNotifications} from "../../_models/notification";
import {SmsService} from "../../_services/sms.service";

import {AlertsService} from "../../_services/alerts.service";

import * as moment from 'moment';
import {AlertController, LoadingController} from "@ionic/angular";

import { ToastController } from '@ionic/angular';

import {LogsService} from "../../_services/logs.service";


@Component({
  selector: 'app-select-notifications',
  templateUrl: './select-notifications.component.html',
  styleUrls: ['./select-notifications.component.scss'],
})
export class SelectNotificationsComponent implements OnInit {

  notifications_for_checks: checks[] = [];

  notifications_to_send: Notification[] = [];

  // sent_successfully_notifications: Notification[] = [];
  not_set_notifications: Notification[] = [];

  sent_notifications: Notification[] = [];

  isAllSelected: boolean = false;


  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private smsService: SmsService,
      private alertsService: AlertsService,
      private alertController: AlertController,
      private toastController: ToastController,
      private loadingController: LoadingController,
      private logsService: LogsService,
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

    this.not_set_notifications = [];
    this.notifications_to_send = [];

    let attempt_starts_at: string;
    let attempt_ends_at: string;

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

    const confirmation = await this.alertsService.confirmationAlert(
        'Aviso',
        'Esas por enviars ' + this.notifications_to_send.length +' notificaciones, ¿Estas seguro de esto?'
    );

    if (!confirmation)
      return;

    attempt_starts_at = moment().format('LTS');
    await this.sendNotifications(this.notifications_to_send);
    attempt_ends_at = moment().format('LTS');

    let sent_notifications: SentNotifications = {
      elements: this.sent_notifications.length,
      starts_at: attempt_starts_at,
      ends_at: attempt_ends_at,
      notifications: this.notifications_to_send
    };

    // CONVERTIR A ASINCRONO
    await this.logsService.saveNotificationLogs(sent_notifications);


    console.log('En este punto ya debiern haberse enviado TODAS las notificaciones');

    /*console.log('Hora de comienzo: ', attempt_starts_at);
    console.log('Hora de termino: ', attempt_ends_at);

    console.log('Array de notificaciones enviadas: ', this.sent_notifications);
    console.log('Array de notificaciones NO enviadas: ', this.not_set_notifications);*/



    // console.log('Notificaciones para enviar: ', this.notifications_to_send);
  }


  async sendNotifications(notifications: Notification[]) {
      let nNot = 1;
      let sent_n: Notification[] = [];
      let not_sent_n: Notification[] = [];

      this.presentLoading();

      for (const notification of notifications) {

          console.time('loop');
          let wasSent = await this.smsService.sendSMSasync(notification.telefono, notification.mensaje);
          console.timeEnd('loop');
          if (wasSent) {
              notification.wasSent = true;
              notification.sentTime = moment().format('LTS');
              sent_n.push(notification);
              this.presentToast('Notificación numero '+nNot+' fue enviado con exito');
              console.log('Mensaje '+nNot+' fue enviado');
          } else {
              notification.wasSent = false;
              // this.not_set_notifications.push(notification);
              notification.sentTime = moment().format('LTS');
              not_sent_n.push(notification);
              this.presentToast('Se produjo un error al intentar enviar la notificación numero '+nNot);
              console.log('Mensaje '+nNot+' NO fue enviado');
          }


          // this.sent_notifications.push(notification);


          nNot++;
      }
      this.closseLoading();

      if (not_sent_n.length > 0) {
          console.log('No se mandaronunas alv!');

          const not_sent_confirmation = await this.alertsService.confirmationAlert(
              'Error',
              'Ocurrio un error: ' + not_sent_n.length +' notificaciones fallaron al enviarse, ¿Quíeres intentar enviar de nuevo estas notificaciones?'
          );

          if (not_sent_confirmation) {
              console.log('Se van a intentar mandar de nuevo..');
              await this.sendNotifications(not_sent_n)
          }

      }

      this.sent_notifications = sent_n;
      console.log('Array de notificaciones ENVIADAS: ', this.sent_notifications);

      if (not_sent_n.length > 0) {
          console.log('Aqui comenzaria el loop para agregar los NO ENVIADOS');
          not_sent_n.forEach(notification => {
              this.sent_notifications.push(notification);
          })
      }

  }


  selectAll($event) {
    console.log('Entrí a la función selectAll: ', $event);
    this.notifications_for_checks.forEach(notification => {
      // console.log('Notificacion: ', notification.isChecked);

      notification.isChecked = this.isAllSelected;

    });
  }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 4000
        });
        toast.present();
    }


    async presentLoading() {
        const loading = await this.loadingController.create({
            spinner: "circular",
            // duration: 5000,
            message: 'Enviando notificaciones..',
            translucent: true,
        });
        return await loading.present();
    }

    closseLoading() {
        this.loadingController.dismiss();
    }




}

class checks {
  notification : Notification;
  isChecked : boolean;
}


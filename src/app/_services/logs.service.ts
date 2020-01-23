import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {SentNotifications} from "../_models/notification";
import {NotificationsLogs} from "../_models/notifications-logs";

import * as moment from 'moment';
import {AlertsService} from "./alerts.service";

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  thisKeyExist: boolean;

  isSaved: boolean = false;

  constructor(
      private storage: Storage,
      private alerstService: AlertsService
  ) { }

  async saveNotificationLogs(sent_notifications: SentNotifications) {

    // await this.storage.remove('notifications_logs');
    // debugger;

    await this.saveSentNotifications(sent_notifications);

    console.log('Terminó');
    console.log('Este es el valor de isSaved: ', this.isSaved);

    if (this.isSaved) {
      let alertResponse: boolean = await this.alerstService.logsConfirmationAlert('Hecho!', 'Las notificaciones han sido enviadas');
      if (alertResponse) {
        console.log('Quiere ver los logs :D');
      } else {
        console.log('No quiere ver tus pinches logs :c');
      }

    } else
      await this.alerstService.presentSimpleAlert(
          'Error',
          'Ocurrio un error al intentar guardar las notificaciones en el storage',
          'Por favor, intentelo de nuevo más tarde o contacte al administrador.'
      );


  }

  async saveSentNotifications(sent_notifications: SentNotifications) {



    await this.checkIfKeyExist('notifications_logs');

      if ( !this.thisKeyExist ) {


        console.log('Entró al IF de thisKeyExist');

        let notifications_logs_array: NotificationsLogs[] = [];


        let notifications_logs:any = await this.buildNewNotificationsLogsObj(sent_notifications);

        // console.log('Esto es lo que devuelve la funcion esta ue hice: ', notifications_logs);

        notifications_logs_array.push(notifications_logs); // Esto tambien ya da un error. Deberia descomentarse(?
        //
        await this.storage.set('notifications_logs', notifications_logs_array).then(()=> this.isSaved = true)
            .catch(err => console.log('Error al intentar guardar este pedo: ', err))

      } else {

        console.log('Entró al ELSE de thisKeyExist');

        await this.storage.get('notifications_logs').then(async data => {
          let logs_temp: NotificationsLogs[] = data;


          let todays_Attempts = logs_temp[logs_temp.length-1].todays_attempts;
          let todays_date = logs_temp[logs_temp.length-1].date;
          // let todays_date = '2020-01-20';

          if ( todays_date === moment().format('YYYY-MM-DD') ) {
            console.log('Si es LA MISMA FECHA ');

            let notifications_logs = await this.buildNewNotificationsLogsObj(sent_notifications, todays_Attempts);

            console.log('Se supone que esto es lo que retorna..: ', notifications_logs);

            // debugger;

            await this.storage.set('notifications_logs', notifications_logs).then(()=> this.isSaved = true)
                .catch(async err => { await this.storageErrorAlert('recuperar', err); });


          } else {
            console.log('NO es LA MISMA FECHA');

            let notifications_logs_array: NotificationsLogs[] = []; // Esto se va a borrar y se va a declarar
                                                                    // en un nivel más alto

            let notifications_logs: any = await this.buildNewNotificationsLogsObj(sent_notifications);

            console.log('Esto es lo que retorna el else..', notifications_logs);
            
            await this.storage.get('notifications_logs').then(data => {
              notifications_logs_array = data;
            }).catch(async err => { await this.storageErrorAlert('recuperar', err); });

            console.log('TIPO DE DATO QUE REGRESA ESTO...', typeof notifications_logs);

            notifications_logs_array.push(notifications_logs); // Esto da un error, no sé por qué deberia descomentarse(?

            await this.storage.set('notifications_logs', notifications_logs_array).then(()=> this.isSaved = true)
                .catch(async err => { await this.storageErrorAlert('guardar', err); });
          }


          console.log('Este es el valor de logs_temp', logs_temp);
        })

      }

  }


  async buildNewNotificationsLogsObj(sent_notifications: SentNotifications, attempt?: number) {

    if ( attempt ) {

      let all_logs: NotificationsLogs[] = [];
      await this.storage.get('notifications_logs').then(data => {
        all_logs = data;
        let current_log: NotificationsLogs = all_logs[(all_logs.length-1)];

        let sent_notifications_array_temp: SentNotifications[] = current_log.sent_notifications;
        sent_notifications_array_temp.push(sent_notifications);

        current_log.todays_attempts = (current_log.todays_attempts+1);
        current_log.sent_notifications = sent_notifications_array_temp;

        all_logs[(all_logs.length-1)] = current_log;

        console.log('Esto es lo que va a retornar el if attempt', all_logs);

      }).catch(async err => { await this.storageErrorAlert('recuperar', err); });

      return all_logs;


    } else {
      console.log('Entra al ELSE del ATTEMPT ');

      let sent_notifications_array: SentNotifications[] = [];
      sent_notifications_array.push(sent_notifications);

      return {
        id: moment().format('YYYYMMDD') + '_1',
        date: moment().format('YYYY-MM-DD'),
        todays_attempts: 1,
        sent_notifications: sent_notifications_array
      };
    }
  }



  async checkIfKeyExist(key: string) {
    return this.storage.get(key).then(res => {
      // console.log('Este es res: ', res);
      if (res != null)
        this.thisKeyExist = true
    });
  }

  testLogs() {
    this.storage.get('notifications_logs').then( data => {
      console.log('Este es el valor de notifications_logs desde el storage: ', data);
    }).catch( err => {
      console.log('Error al intentar recuperar la key notifications_logs del storage: ', err);
    })
  }

  async storageErrorAlert(type: string, error: string) {
    await this.alerstService.presentSimpleAlert('Error', 'Algo fallo al intentar ' + type +' los datos del storage', error)
  }

  clearStorage() {
    this.storage.remove('notifications_logs').then(() => console.log('Se borro el storage'));
  }

}

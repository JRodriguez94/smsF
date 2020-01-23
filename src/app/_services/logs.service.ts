import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {SentNotifications} from "../_models/notification";
import {NotificationsLogs} from "../_models/notifications-logs";

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  thisKeyExist: boolean;

  constructor(
      private storage: Storage
  ) { }

  async saveNotificationLogs(sent_notifications: SentNotifications) {

    // await this.storage.remove('notifications_logs');
    // debugger;

    console.log('Este es el objeto sentNotifications que llega: ', sent_notifications);

    // await this.storage.set('notifications_logs', sent_notifications); // Esto para qué es?

    await this.saveSentNotifications(sent_notifications);

    console.log('Terminó');

    // await this.checkIfKeyExist('notifications_logs');
    /*if ( this.thisKeyExist != true )
      console.log('No existe la llave');
    else
      console.log('Si existe la llave');*/
  }

  async saveSentNotifications(sent_notifications: SentNotifications) {



    await this.checkIfKeyExist('notifications_logs');

      if ( !this.thisKeyExist ) {


        console.log('Entró al IF de thisKeyExist');

        let notifications_logs_array: NotificationsLogs[] = [];


        let notifications_logs = await this.buildNewNotificationsLogsObj(sent_notifications);

        console.log('Esto es lo que devuelve la funcion esta ue hice: ', notifications_logs);

        // notifications_logs_array.push(notifications_logs); // Esto tambien ya da un error. Deberia descomentarse(?

        await this.storage.set('notifications_logs', notifications_logs_array);

      } else {

        console.log('Entró al ELSE de thisKeyExist');

        await this.storage.get('notifications_logs').then(async data => {
          let logs_temp: NotificationsLogs[] = data;

          // console.log('Este es data completo: ', data);

          let todays_Attempts = logs_temp[logs_temp.length-1].todays_attempts;
          let todays_date = logs_temp[logs_temp.length-1].date;
          // let todays_date = '2020-01-20';

          console.log('Aqui tiene que salir el 0', todays_Attempts-1);
          console.log('Aquí deberia salir la fecha del día de hoy: ', todays_date);

          if ( todays_date === moment().format('YYYY-MM-DD') ) {
            console.log('Si es LA MISMA FECHA ');

            let notifications_logs = await this.buildNewNotificationsLogsObj(sent_notifications, todays_Attempts);

            console.log('Se supone que esto es lo que retorna..: ', notifications_logs);

            // debugger;

            await this.storage.set('notifications_logs', notifications_logs);


          } else {
            console.log('NO es LA MISMA FECHA');

            let notifications_logs_array: NotificationsLogs[] = []; // Esto se va a borrar y se va a declarar
                                                                    // en un nivel más alto

            let notifications_logs: any = await this.buildNewNotificationsLogsObj(sent_notifications);

            console.log('Esto es lo que retorna el else..', notifications_logs);


            // El catch de aqui se puede mejorar cambiando el LOG por un ALERT para que el
            // usuario esté enterado de que algo ha fallado. (En teoria es asincrono, pero
            // habria que tener especial cuidado en el proceso)
            await this.storage.get('notifications_logs').then(data => {
              notifications_logs_array = data;
            }).catch(err => { console.log('Error al intentar cargar el local storage: ', err) });

            console.log('TIPO DE DATO QUE REGRESA ESTO...', typeof notifications_logs);

            notifications_logs_array.push(notifications_logs); // Esto da un error, no sé por qué deberia descomentarse(?

            await this.storage.set('notifications_logs', notifications_logs_array);
            // debugger;
          }


          console.log('Este es el valor de logs_temp', logs_temp);
        })

      }

    // console.log('Este seria el objeto notifications_logs desde el storage: ', this.storage.get('notifications_logs'));

  }


  async buildNewNotificationsLogsObj(sent_notifications: SentNotifications, attempt?: number) {
/*    let sent_notifications_array: SentNotifications[] = [];
    sent_notifications_array.push(sent_notifications);*/

    if ( attempt ) {
      /*/!*let sent_notifications_array: SentNotifications[] = [];
      sent_notifications_array.push(sent_notifications);*!/
      console.log('Entra al if del ATTEMPT ');

      let sent_notifications_array: NotificationsLogs[];
      await this.storage.get('notifications_logs').then( data => {
        console.log('Este es data en el deste del aquel..', data);
        sent_notifications_array = data;
      }).catch(err => { console.log('Error al intentar leer el local storage: ', err) });

      console.log('Vamos a ver que sale de esto..', sent_notifications_array[0].sent_notifications);
      console.log('En teoria.. aqui ya deberia contener los dos arreglos de notificaciones..', sent_notifications_array);


      // En teoria setearles directamente el 0 a los arrays tanto de arriba, este siguiente y
      // el de más abajo, no afecta el control del conteo (aparentemente) pero tener especial cuidado.
      sent_notifications_array[0].sent_notifications.push(sent_notifications);


      return {
        id: moment().format('YYYYMMDD') + '_' + (attempt+1),
        date: moment().format('YYYY-MM-DD'),
        todays_attempts: attempt+1,
        sent_notifications: sent_notifications_array[0].sent_notifications
      };*/

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

        // debugger
      }).catch(err => console.log('Ocurrio un error al intentar recuperar los datos: ', err));

      return all_logs;


      // sent_notifications_array.push(newNotLogs);
      // console.log('EN TEORIA ESTE DEBERIA SER EL RESULTADO FINAL(?', sent_notifications_array)

    } else {
      console.log('Entra al ELSE del ATTEMPT ');

      /*let sent_notifications_array: NotificationsLogs;
      await this.storage.get('notifications_logs').then( data => {
        console.log('Este es data en el deste del aquel..', data);
        sent_notifications_array = data;
      }).catch(err => { console.log('Error al intentar leer el local storage: ', err) });

      console.log('Vamos a ver que sale de esto..', sent_notifications_array[0]);
      console.log('En teoria.. aqui ya deberia contener los dos arreglos de notificaciones..', sent_notifications_array);*/

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


  testLogs() {
    this.storage.get('notifications_logs').then( data => {
      console.log('Este es el valor de notifications_logs desde el storage: ', data);
    }).catch( err => {
      console.log('Error al intentar recuperar la key notifications_logs del storage: ', err);
    })
  }

  async checkIfKeyExist(key: string) {
    console.log('Entró a la funcion de checkkey');
    // let keyExist: boolean = false;
    return this.storage.get(key).then(res => {
      console.log('Este es res: ', res);
      if (res != null)
        this.thisKeyExist = true
    });
  }

}

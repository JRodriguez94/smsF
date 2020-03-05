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

  /*
  * @author: Josue Rodriguez <josue@Fiducia.com.mx>
  * @inputs: sent_notifications: SentNotifications
  * @output: none
  * @description: Esta función recibe como parametro un objeto sent_notifications
  * el cual es utulizado para ser enviado tambien como parametro en la
  * función saveSentNotifications que es llamada dentro de esta función.
  * Posteriormente se evalua si han sido guardadas las notificaciones que pueden ser o no
  * enviadas y que, de haber sidas guardadas, se lanzará un alert para preguntar al usuario
  * si es que quiere o no visualizar los logs, de lo contrario, al inclumplir la condifion principal
  * se lanzará un error informando al suuario que no fue posible guardar los datos
  * del intento por enviar las notificaciones.
  * */
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

    /*
   * @author: Josue Rodriguez <josue@Fiducia.com.mx>
   * @inputs: sent_notifications: SentNotifications
   * @output: none
   * @description:
   *    1.0:
   *    Verifica si la variable thisKeyExist tiene un valor true o false (false por defecto)
   *    se ser true el valor de la variable, se declara un arreglo de objetos del tipo BotificationsLogs el
   *    cual es inicialisado con un valor vacio "[]".
   *    Se creaa una variable llamada notifications_logs que es igualada al resultado de la llamada de la función
   *    buildNewNotificationsLogs que se manda a llamar con el objeto sent_notification como parametro.
   *    Posteriormente, dicha variable, se suma (push) al arreglo notifications_logs_array declarado con anterioridad.
   *
   *    2.0:
   *    Else: Si la variable thisKeyExist da como resultado true en la evaluacion del if (1.0) se invoca el punto 2.1
   *
   *        2.1
   *        Se invoca al metodo get() de storage para obtener el elemento con clave 'notifications_logs' siendo almacenado el resultado en la variable
   *        logs_temp del tipo NotificationsLogs[] (array) la cual es declarada enseguida.
   *        Se declara la variable todays_Attempts que es igualada al atributo todays_attempts el ultimo objeto del array de logs_temp.
   *        Se declara la variable todays_date que es igualada al atributo date del ultimo objeto del arreglo de logs_temp.
   *
   *            2.1.1
   *            Se evalua si el valor de la variable todays_date es el mismo que el resultado de la función moment() (la fecha en curso)
   *            Si los valores coinciden, se dclara la variable notifications_logs que se iguala al resultado de la función buildNewNotificationsLogsObj
   *            que se invoca con los el objeto sent_notifications y la variable todays_Attempts como parametros.
   *
   *            2.1.2
   *            Al no pasar la evaluación anteior (2.1.1), se declara la variable notifications_logs_array del tipo NotificationsLogs[] (array)
   *            que es igualado a vacio "[]", se declara la variable notifications_logs que es igualado al resultado de la función
   *            buildNewNotificationsLogsObj que es invocada con el objeto sent_notifications como parametro.
   *            Se invoca el metodo get() de storage para obtener el valor del contenido con la clave 'notifications_logs' para ser asignado
   *            a la variable notifications_logs_array, de lo contrario se ejecuta el catch que invoca a la función storageErrorAlert
   *            con el valor 'recuperar' como parametro.
   *            el objeto notifications_logs es agregado (push) al array de notifications_logs_array.
   *            Finalmente se invoca al metodo set() de storage para guardar el nuevo objeto notifications_logs_array (array) con la clave notifications_logs
   *            (el anterior valor es remplazado). Si algo falla se ejecuta el catch invocando el metodo storageErrorAlert con el valor 'guardar'
   *            como parametro.
   *
   * */
  async saveSentNotifications(sent_notifications: SentNotifications) {



    await this.checkIfKeyExist('notifications_logs');

      // =====  1.0  =====
      if ( !this.thisKeyExist ) {


        console.log('Entró al IF de thisKeyExist');

        let notifications_logs_array: NotificationsLogs[] = [];


        let notifications_logs:any = await this.buildNewNotificationsLogsObj(sent_notifications);

        // console.log('Esto es lo que devuelve la funcion esta ue hice: ', notifications_logs);

        notifications_logs_array.push(notifications_logs); // Esto tambien ya da un error. Deberia descomentarse(?
        //
        await this.storage.set('notifications_logs', notifications_logs_array).then(()=> this.isSaved = true)
            .catch(err => console.log('Error al intentar guardar este pedo: ', err))

      }
      // =====  2.0  =====
      else {

        console.log('Entró al ELSE de thisKeyExist');

        // =====  2.1  =====
        await this.storage.get('notifications_logs').then(async data => {
          let logs_temp: NotificationsLogs[] = data;


          let todays_Attempts = logs_temp[logs_temp.length-1].todays_attempts;
          let todays_date = logs_temp[logs_temp.length-1].date;

          // =====  2.1.1  =====
          if ( todays_date === moment().format('YYYY-MM-DD') ) {
            console.log('Si es LA MISMA FECHA ');

            let notifications_logs = await this.buildNewNotificationsLogsObj(sent_notifications, todays_Attempts);

            console.log('Se supone que esto es lo que retorna..: ', notifications_logs);

            // debugger;

            await this.storage.set('notifications_logs', notifications_logs).then(()=> this.isSaved = true)
                .catch(async err => { await this.storageErrorAlert('recuperar', err); });


          }
          // =====  2.1.2  =====
          else {

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


  /*
  * @author: Josue Rodriguez <josue@Fiducia.com.mx>
  * @inputs: sent_notifications: SentNotifications, (opcional) attempt: bumber
  * @output: all_logs: NotificationsLogs[]
  * @description:
  * 1.0
  * Se evalua si el parametro opcional attempt es recibido como parametro,
  * de ser asíse declarará la variable all_logs de tipo arreglo de objetos NotificationsLogs y a su vez
  * será inicializado en vacio '[]'. Se invocará el metodo get de storage con la clave 'notifications_logs' como parametro
  * y su resultado será igualado a la variable all_logs anteriormente creada.
  * Se declara la variable current_logs del tipo NotificationsLogs y se le asigna el valor del ultimo objeto (array) del objeto all_logs.
  * Se declara la variable sent_notifications_array_temp del tipo SentNotifications[] (Array) y le es asignado el valor de la propiedad
  * sent_notifications de la variable current_log.
  * El objeto sent_notifications que llega a la función como parametro, es añadida (push) al array de sent_notifications_array_temp.
  * la propiedad todays_attempts de current_log es igualado a si mismo más 1. Asi mismo la propiedad sent_notifications es igualada al objeto (array) sent_notifications_array_temp.
  * Al ultimo elemento de la variable all_logs (array) le es asignado el objeto current_log.
  * Finalmente, si el callback de la función falla, se ejecutará el catch que a su vez invovará a la función storageErrorAlert con el valor 'recuperar' como parametro.
  *
  * 2.0
  * Si la evalucaicon de attempt resulta ser false, se declara sent_notifications_array, un array del tipo SentNotifications,
  * al cual se añade (push) el objeto sent_notifications que llega como parametro a la función.
  * Fibalmente, se retorna un objeto que contiene las propiedades:
  * id: (El cual es construido con el resultado de la funcion moment() [con el formato YYYYMMDD] al cual se le concatena '_1')
  * date: (que es en de igual forma, el resultado de moemtn() con le mismo formato YYYYMMDD)
  * todays_attempts: (El cual tiene como valor estatico el numeor 1) y finalmente
  * sent_notifications: (El cual lleva como valor el array de objetos sent_notifications_array)
  */
  async buildNewNotificationsLogsObj(sent_notifications: SentNotifications, attempt?: number) {

    // =====  1.0  =====
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

    // =====  2.0  =====
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


  /*
  * @author: Josue Rodriguez <josue@Fiducia.com.mx>
  * @inputs: key: string
  * @output: promesa
  * @description: Verifica si la clave que es recivida como parametro
  * existe dentro del storage. Si es direrente de null, la variable
  * thisKeyExist toma true como valor.
  * */
  async checkIfKeyExist(key: string) {
    return this.storage.get(key).then(res => {
      if (res != null)
        this.thisKeyExist = true
    });
  }

  /*
 *  ================ TEMPORAL ====================
 * @author: Josue Rodriguez <josue@Fiducia.com.mx>
 * @inputs: none
 * @output: none
 * @description: Muestra el resultado (logs) del metodo get de storagte con la clave 'notifications_logs'
 * como parametro. Si está no existe, se muestra el error.
 * */
  testLogs() {
    this.storage.get('notifications_logs').then( data => {
      console.log('Este es el valor de notifications_logs desde el storage: ', data);
    }).catch( err => {
      console.log('Error al intentar recuperar la key notifications_logs del storage: ', err);
    })
  }

  /*
* @author: Josue Rodriguez <josue@Fiducia.com.mx>
* @inputs: type: string, error: string
* @output: none
* @description: lanza la función presentSimpleAlert de alertService con los parametros de entrada
* concatenados en el mensaje de la alerta.
* */
  async storageErrorAlert(type: string, error: string) {
    await this.alerstService.presentSimpleAlert('Error', 'Algo fallo al intentar ' + type +' los datos del storage', error)
  }

  /*
* @author: Josue Rodriguez <josue@Fiducia.com.mx>
* @inputs: none
* @output: none
* @description: Elimina el elemento del storage con la clave 'notifications_logs' y lansa un log confirmando
* el proceso.
* */
  clearStorage() {
    this.storage.remove('notifications_logs').then(() => console.log('Se borro el storage'));
  }

}

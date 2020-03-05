import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';
import {NotificationsLogs} from "../_models/notifications-logs";

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {

  logs: NotificationsLogs[] = [];
  thereAreLogs: boolean = false;

  constructor(
      private storage: Storage
  ) { }

  /*
  * @author: Josue Rodriguez <Josue@Fiducia.com.mx>
  * @inputs: none
  * @output: none
  * @description: Ejecuta la funcion getLogs de forma asincrona.
  * Si thereArelogs tiene como valor true, se hace un console de los logs, de lo contrario
  * se lanza un console para informar que no existen logs.
  */
  async ngOnInit() {
    console.log('Entró al OnInit');
    await this.getLogs();
    if (this.thereAreLogs) {
      console.log('Estos son los logs: ', this.logs)
    } else {
      console.log('No hay logs')
    }
  }

  /*
  * @author: Josue Rodriguez <Josue@Fiducia.com.mx>
  * @inputs: none
  * @output: none
  * @description: Ejecuta el metodo get() de storage con el valor 'notifications_logs' como clave
  * si el observable devueve datos, se asignan los datos obtenidos a logs y se setea thereAreLogs a true.
  * De producirse un error en el callback del obserbavle, se lanza un log con el error.
  */
  async getLogs() {
    await this.storage.get('notifications_logs').then( data => {
      this.logs = data;
      this.thereAreLogs = true;
    }).catch(err => {
      console.log('No se pudo recuperar los datos: ', err);
    })
  }

}

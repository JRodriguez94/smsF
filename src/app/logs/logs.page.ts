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

  async ngOnInit() {
    console.log('Entró al OnInit');
    await this.getLogs();
    if (this.thereAreLogs) {
      console.log('Estos son los logs: ', this.logs)
    } else {
      console.log('Valio madre')
    }
  }


  async getLogs() {
    await this.storage.get('notifications_logs').then( data => {
      this.logs = data;
      this.thereAreLogs = true;
    }).catch(err => {
      console.log('No se pudo recuperar los datos: ', err);
    })
  }

}

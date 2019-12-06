import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import { Notification } from "../_models/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor( private http: HttpClient ) { }

  getNotifications(){
    return this.http.get<response>('https://api.fiducia.com.mx/test/sms/');
    /*this.http.get<response>('https://api.fiducia.com.mx/test/sms/').subscribe(response => {
      console.log('response desdel servicio: ', response.response);
    })*/
  }

}

class response {
  elapsed: 0.024;
  response: Notification[];
}

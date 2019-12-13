import { Injectable } from '@angular/core';
import {AlertController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor( private alertController: AlertController ) { }


  async presentSimpleAlert(header: string, subheader: string, messaje: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: messaje,
      buttons: ['OK']
    });

    await alert.present();
  }

}

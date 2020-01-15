import { Injectable } from '@angular/core';
import {AlertController} from "@ionic/angular";
import {promise} from "selenium-webdriver";

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


 /* async confirmationAlert(header: string, message: string) {
    let confirmationalert = await this.alertController.create({
    // return await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('El boton de cancelar fue precionado');
            return false
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('El boton de Aceptar fue precionado');
            return true
          }
        }
      ]
    });
    await confirmationalert.present();
  }*/

 async confirmationAlert(header: string, message: string): Promise<boolean> {
    let resolveFunction: (confirm: boolean) => void;
    const promise = new Promise<boolean>(resolve => {
      resolveFunction = resolve;
    });
    const alert = await this.alertController.create({
      header: header,
      message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => resolveFunction(false)
        },
        {
          text: 'Aceptar',
          handler: () => resolveFunction(true)
        }
      ]
    });
    await alert.present();
    return promise;
  }

}

import { Injectable } from '@angular/core';
import {AlertController} from "@ionic/angular";
import {promise} from "selenium-webdriver";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor( private alertController: AlertController ) { }

    /*
    * @author: Josue Rodriguez <josue@Fiducia.com.mx>
    * @inputs: header: string, subheader: string, message: string
    * @output: none
    * @description: Se declara la constante alert que es igualada al metodo create del alertController
    * que a su ves, utiliza los parametros de entrada (header, subheader y message) para crear el alert.
    * Finalmente, mediante la constante alert declarada, se invoca el metodo present() para visualizar el componente.
    * */
  async presentSimpleAlert(header: string, subheader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: message,
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


    /*
   * @author: Josue Rodriguez <josue@Fiducia.com.mx>
   * @inputs: header: string, message: string
   * @output: promise: promise (boolean)
   * @description: Se declara resolveFunction (resolver) del tipo boolean inicializado en void.
   * se declara la constante promise del tipo promise que retorna un dato boolean, el cual es obtenido
   * mediante resolveFunction declarada anteriormente.
   * Se declara la constante alert que se iguala al metodo create() del alertController, la cual usa
   * los parametros de entrada (header y message) para contruir el alert, así como dos botones (Cancelar y Aceptar)
   * los cuales, dependiedo de cual sea precionado, se asignará el valor del resolver.
   * Finalmente, se presenta el alert y se retorna promise.
   * */
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

    /*
   * @author: Josue Rodriguez <josue@Fiducia.com.mx>
   * @inputs: header: string, message: string
   * @output: promise: promise (boolean)
   * @description: Se declara resolveFunction (resolver) del tipo boolean inicializado en void.
   * se declara la constante promise del tipo promise que retorna un dato boolean, el cual es obtenido
   * mediante resolveFunction declarada anteriormente.
   * Se declara la constante alert que se iguala al metodo create() del alertController, la cual usa
   * los parametros de entrada (header y message) para contruir el alert, así como dos botones (Ver Logs y Aceptar)
   * los cuales, dependiedo de cual sea precionado, se asignará el valor del resolver.
   * Finalmente, se presenta el alert y se retorna promise.
   * */
 async logsConfirmationAlert(header: string, message: string): Promise<boolean> {
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
          text: 'Ver Logs',
          handler: () => resolveFunction(true)
        },
        {
          text: 'Aceptar',
          handler: () => resolveFunction(false)
        }
      ]
    });
    await alert.present();
    return promise;
  }

}

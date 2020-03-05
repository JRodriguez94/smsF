import { Injectable } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NotificationsModalPage} from "../_components/modals/notifications-modal/notifications-modal.page";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  // dataReturned:any;

  notificationSelectModal: any;

  constructor(
      private modalController: ModalController

  ) { }

  /*
* @author: Josue Rodriguez <josue@Fiducia.com.mx>
* @inputs: none
* @output: promise
* @description: Invoca el metodo create del modalController, pasando como componente NotificationsModalPage
* y la clase wideModal el cual carga los estlos.
* Retorna el metodo present del notificationSelectModal como promesa.
* */
  async openModal() {
    this.notificationSelectModal = await this.modalController.create({
      component: NotificationsModalPage,
      cssClass: "wideModal",
    });

    /*this.notificationSelectModal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });*/

    return await this.notificationSelectModal.present();
  }

  /*
  * @author: Josue Rodriguez <josue@Fiducia.com.mx>
  * @inputs: none
  * @output: none
  * @description: Cierra el modal activo.
  * */
  closeModal() {
    this.notificationSelectModal.dismiss();
  }

}

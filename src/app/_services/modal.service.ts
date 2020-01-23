import { Injectable } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NotificationsModalPage} from "../_components/modals/notifications-modal/notifications-modal.page";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  dataReturned:any;

  notificationSelectModal: any;

  constructor(
      private modalController: ModalController

  ) { }

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


  closeModal() {
    this.notificationSelectModal.dismiss();
  }

}

import {Component, OnInit} from '@angular/core';

import {AlertController, PickerController} from '@ionic/angular';
import {PickerOptions} from '@ionic/core';

import * as moment from 'moment';

import { NotificationReq } from "../../../_models/notification-req";
import {NotificationsService} from "../../../_services/notifications.service";
import {NavigationExtras, Router} from "@angular/router";
import {ModalService} from "../../../_services/modal.service";


@Component({
    selector: 'app-notifications-modal',
    templateUrl: './notifications-modal.page.html',
    styleUrls: ['./notifications-modal.page.scss'],
})
export class NotificationsModalPage implements OnInit {

    selected_state: any;
    stateWasSelected: boolean = false;

    selectedDataOp: string;
    isAnUpdate: boolean = false;

    radio1optDisable: boolean = true;
    radio2optDisable: boolean = false;
    selectedRadio: boolean[] = [
        false,
        false,
        true
    ];

    calendar_min: string;
    calendar_max: string;

    today_moment: string = moment().format('YYYY/MM/DD');
    // today_moment: string = '13/01/2020';
    // today_moment: string = '2020/01/14';
    today_parsed: string;

    constructor(
        private pickerCtrl: PickerController,
        private alertCtrl: AlertController,
        private notificationsService: NotificationsService,
        private router: Router,
        private modalService: ModalService
    ) {
        // this.today_moment = moment().format('DD/MM/YYYY');
        console.log('A ver como esta saliendo esta madre..', this.today_moment);
        console.log('Este es el tipo de dato que retorna moment: ', typeof this.today_moment);

        this.calendar_min = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
        this.calendar_max = moment().format('YYYY-MM-DD');

        // debugger;

        console.log('Valor de DateSubstract: ', this.calendar_min);
    }

    ngOnInit() {}

    async showPicker() {
        let options: PickerOptions = {
            buttons: [
                {text: 'Cancelar', role: 'cancel'},
                {text: 'Hecho',},
            ],
            columns: [
                {
                    name: 'state',
                    options: [
                        {
                            text: 'Jalisco', value: 'JALISCO',
                        },
                        {
                            text: 'CDMX', value: 'CDMX'
                        },
                        {
                            text: 'Edo. México', value: 'EDOMX'
                        },
                    ]
                }
            ],
        };

        let picker = await this.pickerCtrl.create(options);
        picker.present();
        picker.onDidDismiss().then( async () => {

            this.stateWasSelected = true;

            let col = await picker.getColumn('state');

            this.selected_state = col.options[col.selectedIndex].value;
            console.log('Nombre del estado(?: ', this.selected_state);

            if (this.selected_state === 'JALISCO') {
                this.radio2optDisable = false;
                this.radio1optDisable = true;
                this.switchSelectedRadio(2);
            } else {
                this.radio1optDisable = false;
                this.radio2optDisable = true;
                this.switchSelectedRadio(0);
            }

        })
    }


    dateOnChange($event) {
        console.log('Este es el evento que lanza el picker: ', $event); // --> wil contains $event.day.value, $event.month.value and $event.year.value
        this.today_parsed = NotificationsModalPage.getParsedToday($event);
        console.log('Fecha parseada(? ', this.today_parsed)
    }

    onSubmit() {

      /*console.log('Valor de stateWasSelected es: ', this.stateWasSelected);
        console.log('Valor del picker sin ser modificado (?', this.selected_state);
        console.log('Valor de la variable today_parsed sin hacer el cambio    : ', typeof this.today_parsed,);*/

        if (this.today_parsed === undefined)
            this.today_parsed = NotificationsModalPage.getParsedToday();

        // console.log('this.today_parsed despues del if: ', this.today_parsed);

        if (this.stateWasSelected === false) {
            this.showSimpleAlert('Ups..', '', 'Selecciona un estado antes de continuar.');
            return
        }

        if (this.selected_state === 'Jalisco')
            this.switchSelectedRadio(2);

        for (let indexS = 0; indexS < this.selectedRadio.length; indexS++) {
            if (this.selectedRadio[indexS] === true) {
                this.selectedDataOp = NotificationsModalPage.getRadioKeyValue(indexS);
            }
        }

        let data_req: NotificationReq = {
            nDate: this.today_parsed,
            nState: this.selected_state,
            nData: this.selectedDataOp,
            isAnUpdate: this.isAnUpdate,
        };

        console.log('Test objeto data_req: ', data_req);

        this.notificationsService.getNotificationsByParams(data_req).subscribe( notifications => {


            // *************************************
            let index_id = 0;
            notifications.response.forEach(notification => {
                notification.id = index_id;
                index_id += 1;
            });
            // *************************************


            let navigationExtras: NavigationExtras = {
                state: {
                    notifications: notifications.response
                }
            };

            // console.log('Estas son las notificaciones; ', notifications.response);

            this.modalService.closeModal();

            this.router.navigate(['home/selectn'], navigationExtras);

        });

    }


    static getRadioKeyValue(index: number) : string {
        switch (index) {
            case 0: { return 'FEDERALES'; break; }
            case 1: { return 'ESTATALES'; break; }
            case 2: { return 'AMBOS'; break; }
            default: { return 'NO-ESPECIFICADO'; break; }
        }
    }

    switchSelectedRadio(index: number) {
        for (let indexF = 0; indexF < this.selectedRadio.length; indexF++)
            this.selectedRadio[indexF] = false;

        this.selectedRadio[index] = true;
    }

    changeIsAnUpdate() {
        this.isAnUpdate = !this.isAnUpdate;
    }



    async showSimpleAlert(header: string, subHeader: string, message: string) {
        const alert = await this.alertCtrl.create({
            header: header,
            subHeader: subHeader,
            message: message,
            buttons: ['OK']
        });

        await alert.present();
    }

    static getParsedToday($event ?): string {
        if ($event)
        // return moment($event).format('DD/MM/YYYY');
        return moment($event).format('YYYY/MM/DD');
        else
        // return moment().format('DD/MM/YYYY');
        return moment().format('YYYY/MM/DD');
    }


}


/*class notificationsForm {
    nDate: string;
    nState: string;
    nData: string;
    isAnUpdate: boolean;
}*/

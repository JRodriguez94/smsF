import {Component, OnInit} from '@angular/core';

import {AlertController, PickerController} from '@ionic/angular';
import {PickerOptions} from '@ionic/core';

import * as moment from 'moment';

import { NotificationReq } from "../../../_models/notification-req";
import {NotificationsService} from "../../../_services/notifications.service";
import {NavigationExtras, Router} from "@angular/router";
import {ModalService} from "../../../_services/modal.service";
import {AlertsService} from "../../../_services/alerts.service";


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
        private modalService: ModalService,
        private alertsService: AlertsService
    ) {
        // this.today_moment = moment().format('DD/MM/YYYY');
        console.log('A ver como esta saliendo esto..', this.today_moment);
        console.log('Este es el tipo de dato que retorna moment: ', typeof this.today_moment);

        this.calendar_min = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
        this.calendar_max = moment().format('YYYY-MM-DD');

        // debugger;

        console.log('Valor de DateSubstract: ', this.calendar_min);
    }

    ngOnInit() {}

/*
* @author: Josue Rodriguez <Josue@Fiducia.com.mx>
* @inputs: none
* @output: none
* @description: Se declara el objeto options, el cual contiene subobjetocs como propiedades (buttons, columns)
* de las cuales, tambien se despliegan otro nivel de sub propiedades.
* Se declara picker que se iguala a la instancia el metodo create() de pickerCtrl para despues
* invocar el motodo present() y hacer visuble el picker.
* Posteriormente, se invoca al metodo onDidDismiss de picker y en el callback se invoca
* a una función anonima asincorna que evalua los cambios entre opciones del picker, en donde se define
* la propiedad state y se cargan valores por defecto segun sea el caso de valuación.
*/
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
                            text: 'Edo. México', value: 'EDOMEX'
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

    /*
    * @author: Josue Rodriguez <Josue@Fiducia.com.mx>
    * @inputs: $event
    * @output: none
    * @description: Recive un evento como parametro (una fecha) del cual, su valor es usado
    * para enviarse como parametro al invocar getParsedToday() de NotificationsModalage
    * del cual, su resultado será almarcenaod en today_parsed.
    */
    dateOnChange($event) {
        console.log('Este es el evento que lanza el picker: ', $event); // --> wil contains $event.day.value, $event.month.value and $event.year.value
        this.today_parsed = NotificationsModalPage.getParsedToday($event);
        console.log('Fecha parseada(? ', this.today_parsed)
    }

    /*
    * @author: Josue Rodriguez <Josue@Fiducia.com.mx>
    * @inputs: none
    * @output: none
    * @description:
    * 1: Verifica si today_parsed carece de valor y es mostrada como undefined, de ser así, se asigna esta
    * el valor e la funcion getParsedToday.
    * 2: Verifica el valor de stateWasSelected, de ser false su valor se invoca la funcion presentSimpleAlert
    * del alertService con un mensaje de error que indica al usuario que tiene que seleccionar un Estado para continuar.
    * 3: Verifica el valor de selected_state, de ser 'Jalisco' su valor, se invoca a la funcion switchSelectedRadio con el valor: 2 como parametro.
    * 4: Se itera el array de selectedRadio y por cada iteracion, se evalua si la propiedad selectedRadio del elemento que esta siendo iterado
    * tine un true como valor, y que, de ser así se asigna a la propiedad selectedDataOp el valor que devuelve la funcion getRadioKeyValue con
    * el index del elemento que está sienod iterado.
    * 5: Se crea el objeto data_req del tipo NotificationReq con los valores: today_parsed, selected_state, selectedDataOp y isAnUpdate de sus propiedades.
    * 6: Se invoca a la función getNotificationsByParams de notificationsService con el objeto data_req como parametro. Si el observable devueve
    * los datos correctamente, estos se almacenaran en la variable del mismo llamada notifications.
    * Se itera cada elemento de la popiedad (objeto) response de notifications y se se asigna un id generado allí mismo, en la iteracipon del forEach.
    * Se crea el objeto navigationExtras que serán los 'extra' que seran enviados como parametro en el metodo navigate de router, el cual redireccionará
    * a la ruta home/selectn despues de cerrar el modal.
    * 7: Finalmente, de producirse un error en el obsaervable del punto anterior, se lanzará un alert para informar al suuario de este, esto ejecutando
    * la funcion de presentSimpleAlert del alertService.
    */
    async onSubmit() {

      /*console.log('Valor de stateWasSelected es: ', this.stateWasSelected);
        console.log('Valor del picker sin ser modificado (?', this.selected_state);
        console.log('Valor de la variable today_parsed sin hacer el cambio    : ', typeof this.today_parsed,);*/
        // 1
        if (this.today_parsed === undefined)
            this.today_parsed = NotificationsModalPage.getParsedToday();

        // console.log('this.today_parsed despues del if: ', this.today_parsed);
        // 2
        if (this.stateWasSelected === false) {
            await this.alertsService.presentSimpleAlert(
                'Ups..',
                '',
                'Selecciona un estado antes de continuar.'
            );
            return
        }
        // 3
        if (this.selected_state === 'Jalisco')
            this.switchSelectedRadio(2);
        // 4
        for (let indexS = 0; indexS < this.selectedRadio.length; indexS++) {
            if (this.selectedRadio[indexS] === true) {
                this.selectedDataOp = NotificationsModalPage.getRadioKeyValue(indexS);
            }
        }
        // 5
        let data_req: NotificationReq = {
            nDate: this.today_parsed,
            nState: this.selected_state,
            nData: this.selectedDataOp,
            isAnUpdate: this.isAnUpdate,
        };

        console.log('Test objeto data_req: ', data_req);
        // 6
        this.notificationsService.getNotificationsByParams(data_req).subscribe( notifications => {

            console.log('Esto es lo que está respondiendo la API...', notifications);

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

        }, err => {
            // 7
            this.alertsService.presentSimpleAlert(
                'Error',
                'Ocurrio un error en la comunicación con el servidor. Intentalo de nuevo más tarde o contacta al administrador',
                'Error: '+ JSON.stringify(err)
            );
        });

    }


    /*
   * @author: Josue Rodriguez <Josue@Fiducia.com.mx>
   * @inputs: index: number
   * @output: string
   * @description: Recive a index (number) como parametro y retorna
   * un string segun el case del switch.
   */
    static getRadioKeyValue(index: number) : string {
        switch (index) {
            case 0: { return 'FEDERALES'; break; }
            case 1: { return 'ESTATALES'; break; }
            case 2: { return 'AMBOS'; break; }
            default: { return 'NO-ESPECIFICADO'; break; }
        }
    }

    /*
   * @author: Josue Rodriguez <Josue@Fiducia.com.mx>
   * @inputs: index: number
   * @output: none
   * @description: Crea un ciclo for para recorrer el array de selectedRadio
   * seteando el valor false a cada elemento en dentro de la iteracion.
   * Finalmente, el index que entra como parametro a la funcion, es utilizado para
   * definir que elemento será cambiado a true dentro dle mismo array ya iterado.
   */
    switchSelectedRadio(index: number) {
        for (let indexF = 0; indexF < this.selectedRadio.length; indexF++)
            this.selectedRadio[indexF] = false;

        this.selectedRadio[index] = true;
    }

    /*
    * @author: Josue Rodriguez <Josue@Fiducia.com.mx>
    * @inputs: none
    * @output: none
    * @description: Cambia el valor de isAnUpdate con el valor (boolean) contrario al actual.
    */
    changeIsAnUpdate() {
        this.isAnUpdate = !this.isAnUpdate;
    }

    /*
   * @author: Josue Rodriguez <Josue@Fiducia.com.mx>
   * @inputs: $event ?
   * @output: moment: object
   * @description: Si se recibe un evento como parametro (fecha), este es utilizado como parametro
   * para invocar moment() que devuelve la misma fecha (evento) con foemato YYYY/MM/DD. De no recibir
   * $event como parametro, se retorna moment() con la fecha actual, de igual forma utilizando el
   * formato YYYY/MM/DD.
   */
    static getParsedToday($event ?): string {
        if ($event)
        // return moment($event).format('DD/MM/YYYY');
        return moment($event).format('YYYY/MM/DD');
        else
        // return moment().format('DD/MM/YYYY');
        return moment().format('YYYY/MM/DD');
    }


}


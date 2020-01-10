import {Component, OnInit} from '@angular/core';

import {AlertController, PickerController} from '@ionic/angular';
import {PickerOptions} from '@ionic/core';

import * as moment from 'moment';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
    selector: 'app-notifications-modal',
    templateUrl: './notifications-modal.page.html',
    styleUrls: ['./notifications-modal.page.scss'],
})
export class NotificationsModalPage implements OnInit {

    selected_state: any;

    stateWasSelected: boolean = false;

    // areEnableRB: boolean = true;
    isAnUpdate: boolean = false;
    selectedDataOp: string;

    check1ptDisable: boolean = true;
    check2ptDisable: boolean = false;


    calendar_min: string;
    calendar_max: string;

    today_moment: any;
    today_parsed: string;

    selectedCheck: boolean[] = [
        false,
        false,
        true
    ];

    modalForm: FormGroup = this.formBuilder.group({});


    constructor(
        private pickerCtrl: PickerController,
        private alertCtrl: AlertController,
        private formBuilder: FormBuilder
    ) {
        this.today_moment = moment().format('DD/MM/YYYY');
        console.log('A ver como esta saliendo esta madre..', this.today_moment);
        this.calendar_min = moment().subtract(1, 'weeks').format('YYYY-MM-DD');
        this.calendar_max = moment().format('YYYY-MM-DD');

        console.log('Valor de DateSubstract: ', this.calendar_min);
    }

    ngOnInit() {
        // this.modalFormConstructor();
        // console.log('Moment(?', moment().format('MM/DD/YYYY'));
        // console.log('Moment Substract', moment().subtract(1, 'weeks').format('MM/DD/YYYY'));
    }


   /* modalFormConstructor() {
        this.modalForm = this.formBuilder.group({
            dataRequiredOp1: ['',],
            dataRequiredOp2: ['',],
            dataRequiredOp3: ['',]
        });
    }*/


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
        picker.onDidDismiss().then(async data => {

            this.stateWasSelected = true;


            let col = await picker.getColumn('state');
            // console.log('Columna seleccionada: ', col);

            this.selected_state = col.options[col.selectedIndex].value;
            console.log('Nombre del estado(?: ', this.selected_state);


            if (this.selected_state === 'JALISCO') {
                // console.log('Entro al if para habilitar/deshabilitar checks');
                this.check2ptDisable = false;
                this.check1ptDisable = true;
                this.switchSelectedRadio(2);
            } else {
                this.check1ptDisable = false;
                this.check2ptDisable = true;
                // console.log('Este es el valor de areEnableRB: ', this.areEnableRB);
                this.switchSelectedRadio(0);
            }

        })
    }


    sendReq() {
        // console.log('Este es el valor de today_moment: ', this.today_moment)
    }


    dateOnChange($event) {
        console.log('Este es el evento que lanza el picker: ', $event); // --> wil contains $event.day.value, $event.month.value and $event.year.value
        // console.log('Tipo de dato del evento: ', typeof $event);
        // this.today_parsed = moment($event).format('DD/MM/YYYY');
        this.today_parsed = NotificationsModalPage.getParsedToday($event);
        console.log('Fecha parseada(? ', this.today_parsed)
    }

    testVlidation() {


        // Forsa un select en el radio 3 para evitar las otras opciones para el estado de laisco


        console.log('Valor de stateWasSelected es: ', this.stateWasSelected);
        console.log('Valor del picker sin ser modificado (?', this.selected_state);
        console.log('Valor de la variable today_parsed sin hacer el cambio    : ', typeof this.today_parsed,);

        if (this.today_parsed === undefined) {
            console.log('Entró al log de undefined');
            // this.today_parsed = moment().format('DD/MM/YYYY');
            this.today_parsed = NotificationsModalPage.getParsedToday();
        }

        console.log('this.today_parsed despues del if: ', this.today_parsed);


        if (this.stateWasSelected === false) {
            this.showSimpleAlert('Ups..', '', 'Selecciona un estado antes de continuar.');
            return
        }

        if (this.selected_state === 'Jalisco')
            this.switchSelectedRadio(2);

        for (let indexS = 0; indexS < this.selectedCheck.length; indexS++) {
            if (this.selectedCheck[indexS] === true) {
                this.selectedDataOp = NotificationsModalPage.getRadioKeyValue(indexS);
            }
        }
        console.log('Terminó la pinche iteración :D');

        let data_req: notificationsForm = {
            nDate: this.today_parsed,
            nState: this.selected_state,
            nData: this.selectedDataOp,
            isAnUpdate: this.isAnUpdate,
        };

        console.log('Test objeto data_req: ', data_req);


        console.log('Si pasó por aquí, quiere decir que se paso por los huevos el return');

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

        for (let indexF = 0; indexF < this.selectedCheck.length; indexF++)
            this.selectedCheck[indexF] = false;

        this.selectedCheck[index] = true;
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


class notificationsForm {
    nDate: string;
    nState: string;
    nData: string;
    isAnUpdate: boolean;
}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsModalPageRoutingModule } from './notifications-modal-routing.module';

import { NotificationsModalPage } from './notifications-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsModalPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [NotificationsModalPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class NotificationsModalPageModule {}

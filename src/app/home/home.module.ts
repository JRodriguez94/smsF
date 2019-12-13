import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import {SelectNotificationsComponent} from "./select-notifications/select-notifications.component";
import {HomeRoutingModule} from "./home-routing.module";

// import { SMS } from '@ionic-native/sms/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeRoutingModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
      HomePage,
      SelectNotificationsComponent
  ],
  providers: [
      // SMS
  ]
})
export class HomePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';






@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatInputModule
  ],
  exports: [
    MatExpansionModule,
    MatInputModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppMaterialModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    PublicComponent
  ],
  imports: [
    CommonModule,
    SharedModule

  ],
  exports:[
    PublicComponent
  ]
})
export class PublicModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public.component';



@NgModule({
  declarations: [
    PublicComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    PublicComponent
  ]
})
export class PublicModule { }

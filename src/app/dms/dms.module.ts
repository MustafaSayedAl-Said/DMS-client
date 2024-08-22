import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryComponent } from './directory/directory.component';
import { DmsComponent } from './dms.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [DmsComponent, DirectoryComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    DirectoryComponent,
    DmsComponent
  ]
})
export class DmsModule { }

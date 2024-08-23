import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DmsComponent } from './dms/dms.component';
import { DirectoryContentsComponent } from './dms/directory-contents/directory-contents.component';
import { PublicComponent } from './public/public.component';

const routes: Routes = [
  {path:'', component:PublicComponent},
  {path:'dms', loadChildren:()=> import('./dms/dms.module').then(mo=>mo.DmsModule)},
  {path:'**', redirectTo:'',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

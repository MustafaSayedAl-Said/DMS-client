import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { adminAuthGuard } from '../../core/guards/admin-auth.guard';

const routes: Routes = [
  { path: '', component: UsersComponent, canActivate: [adminAuthGuard] },
  {
    path: 'workspace/:id/:name',
    loadChildren: () =>
      import('./workspace-content/workspace-content.module').then(
        (mo) => mo.WorkspaceContentModule
      ),
    canActivate: [adminAuthGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

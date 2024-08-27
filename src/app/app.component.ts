import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from './account/account.service';
import { IWorkspace } from './shared/Models/Workspaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  showHeader: boolean = true;
  title = 'DMS';
  constructor(private router: Router, private accountService: AccountService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader =
          !event.url.includes('/account/login') &&
          !event.url.includes('/account/register');
      }
    });
  }

  loadCurrentUser() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.accountService.loadCurrentUser(token).subscribe({
          next: () => {
            console.log('load successfully');
            this.loadWorkspace();
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    }
  }
  loadWorkspace() {
    this.accountService.getWorkspace().subscribe({
      next: (workspace: IWorkspace) => {
        this.accountService.setWorkspaceName(workspace.name);
        this.accountService.setWorkspaceId(workspace.id)
        console.log('Workspace name loaded: ', name);
      },
      error: (err) => {
        console.log('Error loading workspace name', err);
      },
    });
  }
  

  ngOnInit(): void {
    this.loadCurrentUser();
  }
}

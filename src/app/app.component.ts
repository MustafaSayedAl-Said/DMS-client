import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from './account/account.service';

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
      //if (token) {
      this.accountService.loadCurrentUser(token).subscribe({
        next: () => {
          console.log('load successfully');
        },
        error: (err) => {
          console.log(err);
        },
      });
      //}
    }
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }
}

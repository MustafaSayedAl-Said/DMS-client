import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { Observable } from 'rxjs';
import { IUser } from '../../shared/Models/user';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  constructor(private accountService: AccountService) {}
  currentUser$ : Observable<IUser>;
  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
  }
}

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { delay, map, Observable } from 'rxjs';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private accountServices: AccountService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.accountServices.currentUser$.pipe(
      map((auth) => {
        if (auth) {
          return true;
        }
        this.router.navigate(['account/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
    );
  }
}

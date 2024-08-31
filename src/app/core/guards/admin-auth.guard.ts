import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AccountService } from '../../account/account.service';
import { map, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class adminAuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((auth) => {
        const token = localStorage.getItem('token');

        if (auth && auth.isAdmin) {
          console.log('User is an admin');
          return true;
        }

        if (token) {
          try {
            const decodedToken: any = jwtDecode(token);

            // Check if the token is expired
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
              console.log('Token is expired');
              this.router.navigate([''], {
                queryParams: { returnUrl: state.url },
              });
              return false;
            }
            const isAdmin = decodedToken.isAdmin;
            if (isAdmin) {
              console.log('User is an admin');
              return true;
            } else {
              console.log('User is not an admin');
              this.router.navigate(['/'], {
                queryParams: { returnUrl: state.url },
              });
              return false;
            }
          } catch (error) {
            console.error('Invalid token format', error);
            this.router.navigate(['account/login'], {
              queryParams: { returnUrl: state.url },
            });
            return false;
          }
        }
        console.log('No user authenticated and no valid token');
        this.router.navigate(['account/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
    );
  }
}

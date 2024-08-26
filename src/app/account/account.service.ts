import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, ReplaySubject } from 'rxjs';
import { IUser } from '../shared/Models/user';
import { Router } from '@angular/router';
import { IWorkspace } from '../shared/Models/Workspaces';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  _baseURL = 'https://localhost:7030/api/';
  private currentUser = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUser.asObservable();

  constructor(private http:HttpClient, private router:Router) { }

  // getCurrentUserValue(){
  //   return this.currentUser.value;
  // }
  loadCurrentUser(token:string){
    if(token === null){
      this.currentUser.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    return this.http.get(this._baseURL + 'users/current', {headers}).pipe(
      map((user:IUser) => {
        if(user) {
          localStorage.setItem('token', user.token);
          this.currentUser.next(user);
        }
      })
    )
  }

  login(value:any){
    return this.http.post(this._baseURL + 'users/login', value).pipe(
      map((user:IUser) => {
        if(user){
          localStorage.setItem('token', user.token);
          this.currentUser.next(user);
        }
      })
    )
  }

  register(value:any){
    console.log(value);
    return this.http.post(this._baseURL + 'users/register', value).pipe(
      map((user:IUser) => {
        if(user){
          localStorage.setItem('token', user.token);
          this.currentUser.next(user);
        }
      })
    )
  }

  logout(){
    localStorage.removeItem('token');
    this.currentUser.next(null);
    this.router.navigateByUrl('/')
  }

  checkEmailExist(email:string){
    return this.http.get(this._baseURL + 'users/check?email=' + email);
  }

  getWorkspaceId(token: string){
    let headers = new HttpHeaders();
    if(token === null){
      this.currentUser.next(null);
      return of(null);
    }
    headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<IWorkspace>(this._baseURL + 'users/workspace').pipe(
      map(response => {
        return response.id;
      })
    );
  }

}

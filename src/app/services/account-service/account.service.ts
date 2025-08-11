import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoryService } from '../repository.service';
import { AuthenticateModel } from '../../models/account-model';
import {  map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
   constructor(private router: Router, private repositoryService: RepositoryService) {}

  login(authenticateModel: AuthenticateModel) {
    return this.repositoryService.post('Account/login', authenticateModel, false).pipe(
      map((user: any) => {
        localStorage.setItem('BS_access_token', user.token);
       localStorage.setItem('BS_Roles', JSON.stringify(user.roles));
        return user;
      })
    );
  }
 ResetPassword(data:any) {
    return this.repositoryService.post('User/reset-password', data,true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getToken() {
    return localStorage.getItem('BS_access_token');
  }
  getRoles(){
    let roles = localStorage.getItem('BS_Roles');
    if (roles) {
      return JSON.parse(roles);
    }
    return [];
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('BS_access_token');
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('BS_access_token');
    
    if (removeToken == null ) {
      this.router.navigateByUrl('/');
    }
  }

}

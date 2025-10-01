import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoryService } from '../repository.service';
import { AuthenticateModel } from '../../models/account-model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(
    private router: Router,
    private repositoryService: RepositoryService
  ) {}

  login(authenticateModel: AuthenticateModel) {
    return this.repositoryService
      .post('Account/login', authenticateModel, false)
      .pipe(
        map((user: any) => {
          localStorage.setItem('DF_access_token', user.token);
          localStorage.setItem('DF_Roles', JSON.stringify(user.roles));
          return user;
        })
      );
  }
  ResetPassword(data: any) {
    return this.repositoryService.post('User/reset-password', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getToken() {
    return localStorage.getItem('DF_access_token');
  }
  getRoles() {
    let roles = localStorage.getItem('DF_Roles');
    if (roles) {
      return JSON.parse(roles);
    }
    return [];
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('DF_access_token');
    return authToken !== null ? true : false;
  }
  doLogout() {
      localStorage.removeItem('DF_access_token');
      this.router.navigateByUrl('/login');
    
  }
  getBusinessUnitId() {
    return localStorage.getItem('DF_businessUnitId');
  }
  getBusinessUnitName() {
    return localStorage.getItem('DF_businessUnit_Name');
  }
}

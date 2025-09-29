import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
     {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path:'login',
        component:LoginComponent
    },
    { path: 'dairyFarm', loadChildren: () => import('./components/users/dairy-farm/dairy-farm-routing.module').then(m => m.DairyFarmRoutingModule) },
    { path: 'superAdmin', loadChildren: () => import('./components/super-admin/super-admin-routing.module').then((m) => m.SuperAdminRoutingModule) },


];

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { IsloginComponent } from './components/islogin/islogin.component';

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
    {
        path:'isLogin',
        component:IsloginComponent
    },
    { path: 'superAdmin', loadChildren: () => import('./components/super-admin/super-admin-routing.module').then((m) => m.SuperAdminRoutingModule) },
    { path: 'dairyFarm', loadChildren: () => import('./components/users/dairy-farm/dairy-farm-routing.module').then(m => m.DairyFarmRoutingModule) },
    { path: 'poultryFarm', loadChildren: () => import('./components/users/poultry-farm/poultry-farm-routing.module').then((m) => m.PoultryFarmRoutingModule) },
    { path: 'coldStore', loadChildren: () => import('./components/users/cold-store/cold-store-routing.module').then((m) => m.ColdStoreRoutingModule) },
    { path: 'storageUnit', loadChildren: () => import('./components/users/storage-unit/storage-unit-routing.module').then((m) => m.StorageUnitRoutingModule) },


    // { path: '', redirectTo: 'user/dashboard', pathMatch: 'full' }

];

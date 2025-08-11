import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DairyFarmComponent } from './dairy-farm.component';
import { DairyFarmBusinessComponent } from './dairy-farm-business/dairy-farm-business.component';

const routes: Routes = [
   {
    path: '',
    component: DairyFarmComponent,
     children: [
          {
            path: '',
            redirectTo: 'businessUnit',
            pathMatch: 'full',
          },
          {
            path: 'businessUnit',
            component: DairyFarmBusinessComponent,
          }
        ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DairyFarmRoutingModule { }

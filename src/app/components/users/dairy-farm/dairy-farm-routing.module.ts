import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DairyFarmComponent } from './dairy-farm.component';
import { DairyFarmBusinessComponent } from './dairy-farm-business/dairy-farm-business.component';
import { AnimalComponent } from './animal/animal.component';
import { BreedComponent } from './breed/breed.component';
import { FeedComponent } from './feed/feed.component';
import { MilkProductionComponent } from './milk-production/milk-production.component';
import { PregnancyRecordComponent } from './pregnancy-record/pregnancy-record.component';

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
          },
          {
            path: 'animal',
            component:AnimalComponent,
          },
          {
            path: 'breed',
            component:BreedComponent,
          },
          {
            path: 'feed',
            component:FeedComponent,
          },
           {
            path: 'milk-production',
            component:MilkProductionComponent,
          },
           {
            path: 'pregnancy-record',
            component:PregnancyRecordComponent,
          }
        ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DairyFarmRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DairyFarmComponent } from './dairy-farm.component';
import { DairyFarmBusinessComponent } from './dairy-farm-business/dairy-farm-business.component';
import { AnimalComponent } from './animal/animal.component';
import { BreedComponent } from './breed/breed.component';
import { FeedComponent } from './feed/feed.component';
import { MilkProductionComponent } from './milk-production/milk-production.component';
import { PregnancyRecordComponent } from './pregnancy-record/pregnancy-record.component';
import { HealthRecordComponent } from './health-record/health-record.component';
import { EditAnimalComponent } from './animal/edit-animal/edit-animal.component';
import { EditBreedComponent } from './breed/edit-breed/edit-breed.component';

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
            path: 'animal/:id',
            component:EditAnimalComponent,
          },
          {
            path: 'breed',
            component:BreedComponent,
          },
          {
            path: 'breed/:id',
            component:EditBreedComponent,
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
          ,
           {
            path: 'health-record',
            component:HealthRecordComponent,
          }
        ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DairyFarmRoutingModule { }

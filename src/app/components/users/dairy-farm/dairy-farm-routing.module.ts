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
import { EditFeedComponent } from './feed/edit-feed/edit-feed.component';
import { EditMilkProductionComponent } from './milk-production/edit-milk-production/edit-milk-production.component';
import { EditPregnancyRecordComponent } from './pregnancy-record/edit-pregnancy-record/edit-pregnancy-record.component';
import { EditHealthRecordComponent } from './health-record/edit-health-record/edit-health-record.component';
import { VaccinationComponent } from './vaccination/vaccination.component';
import { EditVaccinationComponent } from './vaccination/edit-vaccination/edit-vaccination.component';
import { VaccineComponent } from './vaccine/vaccine.component';
import { EditVaccineComponent } from './vaccine/edit-vaccine/edit-vaccine.component';
import { FinanceReportComponent } from './finance-report/finance-report.component';

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
        component: AnimalComponent,
      },
      {
        path: 'animal/:id',
        component: EditAnimalComponent,
      },
      {
        path: 'breed',
        component: BreedComponent,
      },
      {
        path: 'breed/:id',
        component: EditBreedComponent,
      },
      {
        path: 'feed',
        component: FeedComponent,
      },
      {
        path: 'feed/:id',
        component: EditFeedComponent,
      },
      {
        path: 'milk-production',
        component: MilkProductionComponent,
      },
      {
        path: 'milk-production/:id',
        component: EditMilkProductionComponent,
      },
      {
        path: 'pregnancy-record',
        component: PregnancyRecordComponent,
      },
      {
        path: 'pregnancy-record/:id',
        component: EditPregnancyRecordComponent,
      },
      {
        path: 'health-record',
        component: HealthRecordComponent,
      },
      {
        path: 'health-record/:id',
        component: EditHealthRecordComponent,
      },
      {
        path: 'vaccination',
        component: VaccinationComponent,
      },
      {
        path: 'vaccination/:id',
        component: EditVaccinationComponent,
      },
      {
        path: 'vaccine',
        component: VaccineComponent,
      },
      {
        path: 'vaccine/:id',
        component: EditVaccineComponent,
      },
      {
        path: 'finance-report',
        component: FinanceReportComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DairyFarmRoutingModule {}

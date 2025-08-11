import { Injectable } from '@angular/core';
import { RepositoryService } from './repository.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DairyFarmService {

   constructor(private repositoryService: RepositoryService) {}
   addBusinessUnit(data: any) {
       return this.repositoryService
         .post('BusinessUnit/add-business-unit', data, true)
         .pipe(
           map((response: any) => {
             return response;
           })
         );
     }
}

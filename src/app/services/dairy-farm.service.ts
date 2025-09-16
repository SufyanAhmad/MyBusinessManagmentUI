import { Injectable } from '@angular/core';
import { RepositoryService } from './repository.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
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
  getAnimalBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'Animal/get-animal-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetAnimalDetail(id: any) {
    return this.repositoryService.get('Animal/get-animal/' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  UpdateAnimalDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('Animal/update-animal/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}

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
  addAnimal(data: any) {
    return this.repositoryService.post('Animal/add-animal', data, true).pipe(
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
  getBreedBySearchFilter(data: any) {
    return this.repositoryService
      .post('Breed/get-bread-by-search-and-filter-with-pagination', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addBreed(data: any) {
    return this.repositoryService.post('Breed/add-breed', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  GetBreedDetail(id: any) {
    return this.repositoryService.get('Breed/get-bread/' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  UpdateBreedDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('Breed/update-breed/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getFeedBySearchFilter(data: any) {
    return this.repositoryService
      .post('Feed/get-feed-by-search-and-filter-with-pagination', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addFeed(data: any) {
    return this.repositoryService.post('Feed/add-feed', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  GetFeedDetail(id: any) {
    return this.repositoryService.get('Feed/get-feed/' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  UpdateFeedDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('Feed/update-feed/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getMilkProductionBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'MilkProduction/get-milkProduction-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetMilkProductionDetail(id: any) {
    return this.repositoryService
      .get('MilkProduction/get-milkProduction/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addMilkProduction(data: any) {
    return this.repositoryService
      .post('MilkProduction/add-milkProduction', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  UpdateMilkProductionDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('MilkProduction/update-milkProduction/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getPregnancyRecordBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'PregnancyBirthRecord/get-pregnancyBirthRecord-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addPregnancyRecord(data: any) {
    return this.repositoryService
      .post('PregnancyBirthRecord/add-pregnancyBirthRecord', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetPregnancyRecordDetail(id: any) {
    return this.repositoryService
      .get('PregnancyBirthRecord/get-pregnancyBirthRecord/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  UpdatePregnancyRecordDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile(
        'PregnancyBirthRecord/update-pregnancyBirthRecord/' + id,
        data
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getHealthVaccinationRecordBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'HealthVaccinationRecord/get-healthVaccinationRecord-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  addHealthVaccinationRecord(data: any) {
    return this.repositoryService
      .post('HealthVaccinationRecord/add-healthVaccinationRecord', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetHealthVaccinationRecordDetail(id: any) {
    return this.repositoryService
      .get('HealthVaccinationRecord/get-healthVaccinationRecord/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  UpdateHealthVaccinationRecordDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile(
        'HealthVaccinationRecord/update-healthVaccinationRecord/' + id,
        data
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}

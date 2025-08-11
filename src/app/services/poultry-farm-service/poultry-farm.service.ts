import { Injectable } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoultryFarmService {
  constructor(private repositoryService: RepositoryService) {}
  AddLiveStockBatch(data: any) {
    return this.repositoryService
      .post('LivestockBatch/add-live-stock-batch', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetLivestockBatchBySearch(data: any) {
    return this.repositoryService
      .post(
        'LivestockBatch/get-live-stock-batch-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetLiveStockDetail(id: any) {
    return this.repositoryService
      .get('LivestockBatch/get-live-stock-batch/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  UpdateLiveStockDetail(id: any, data: any) {
    return this.repositoryService
      .putWithOutFile('LivestockBatch/update-live-stock-batch/' + id, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getLiveBatchNames() {
    return this.repositoryService
      .get('Master/get-live-stock-batches', true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetVaccinationBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'Vaccination/get-vaccination-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  AddVaccination(data: any) {
    return this.repositoryService
      .post('Vaccination/add-vaccination', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  geVaccinationById(id: any) {
    return this.repositoryService
      .get('Vaccination/get-vaccination/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  AddFeedStockBatch(data: any) {
    return this.repositoryService
      .post('FeedStock/add-feed-stock', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetFeedstockBatchBySearch(data: any) {
    return this.repositoryService
      .post(
        'FeedStock/get-feed-stock-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  AddFlock(data: any) {
    return this.repositoryService.post('Flock/add-flock', data, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  GetFlocksBySearchFilter(data: any) {
    return this.repositoryService
      .post('Flock/get-flock-by-search-and-filter-with-pagination', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  geFlockById(id: any) {
    return this.repositoryService
      .get('Flock/get-flock-detail?flockId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetFeedRecordBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'FeedRecord/get-feed-record-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  AddFeedRecord(data: any) {
    return this.repositoryService
      .post('FeedRecord/add-feed-record', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getFeedRecordById(id: any) {
    return this.repositoryService
      .get('FeedRecord/get-feed-record-detail/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetEggProductionBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'EggProduction/get-eggProduction-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  AddEggProduction(data: any) {
    return this.repositoryService
      .post('EggProduction/add-eggProduction', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  GetEggTransferBySearchFilter(data: any) {
    return this.repositoryService
      .post(
        'EggTransfer/get-egg-transfer-by-search-and-filter-with-pagination',
        data,
        true
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  AddEggTransfer(data: any) {
    return this.repositoryService
      .post('EggTransfer/add-egg-transfer', data, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getEggTransferById(id: any) {
    return this.repositoryService
      .get('EggTransfer/get-egg-transfer-detail/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  geEggProductionById(id: any) {
    return this.repositoryService
      .get('EggProduction/get-eggProduction/' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}

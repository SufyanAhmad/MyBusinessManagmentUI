import { Injectable } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private repositoryService: RepositoryService) {}
  getBusinessTypes() {
    return this.repositoryService.get('Master/get-business-types', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getBusinessUnitTypes() {
    return this.repositoryService.get('Master/get-business-units', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getBusinessUnitTypesById(id: any) {
    let url;
    if (id != null) {
      // If id is provided, fetch business units for that specific business type
      url = 'Master/get-business-units?businessTypeId=' + id;
    } else {
      // If no id is provided, fetch all business units
      url = 'Master/get-business-units';
    }
    return this.repositoryService.get(url, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getUserRole() {
    return this.repositoryService.get('Master/get-user-roles', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getProductTypes() {
    return this.repositoryService.get('Master/get-product-types', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getProductUnits(id: any) {
    return this.repositoryService
      .get('Master/get-units?productTypeId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getTypes(id: any) {
    return this.repositoryService
      .get('Master/get-types?productTypeId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getVarietiesTypes(id: any) {
    return this.repositoryService
      .get('Master/get-varieties?productTypeId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getBusinessUnitsById(id: any) {
    return this.repositoryService
      .get('Master/get-business-units?businessUnitId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getPartyTypesById(id: any) {
    return this.repositoryService.get('Master/get-parties' + id, true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getPartyTypesByPartyId(id: any) {
    return this.repositoryService
      .get('Master/get-parties?partyTypeId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getPartyTypes() {
    return this.repositoryService.get('Master/get-parties', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getParties(id: any) {
    return this.repositoryService
      .get('Master/get-parties?partyTypeId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getEmployeeTypes() {
    return this.repositoryService.get('Master/get-employee-types', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getRackTypesById(id: any) {
    return this.repositoryService
      .get('Master/get-cold-store-shelfs?businessUnitId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getRoomTypesById(id: any) {
    return this.repositoryService
      .get('Master/get-rooms?businessUnitId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getStocksTypesById(id: any) {
    return this.repositoryService
      .get('Master/get-stocks?businessUnitId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getFlockRef(id: any) {
    return this.repositoryService
      .get('Master/get-flocks?businessUnitId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getFeedTypes() {
    return this.repositoryService.get('Master/get-feed-types', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getFlocksById(id: any) {
    return this.repositoryService
      .get('Master/get-flocks?partyTypeId=' + id, true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getProducts() {
    return this.repositoryService.get('Master/get-products', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  // Dairy Farm //
  getAnimalTypes() {
    return this.repositoryService.get('Master/get-animal-types', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAnimalStatus() {
    return this.repositoryService.get('Master/get-animal-statuses', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAnimal() {
    return this.repositoryService.get('Master/get-animals', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getBreeds() {
    return this.repositoryService.get('Master/get-breed-types', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getHealthVaccinationRecords() {
    return this.repositoryService
      .get('Master/get-healthVaccinationRecords', true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getAnimalHealthVaccinationStatus() {
    return this.repositoryService
      .get('Master/get-animalHealthVaccination-status', true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getUserRoles() {
    return this.repositoryService.get('Master/get-user-roles', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getMedicineType() {
    return this.repositoryService.get('Master/get-medicine-types', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getMedicine() {
    return this.repositoryService.get('Master/get-medicines', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAnimalColor() {
    return this.repositoryService.get('Master/get-animal-colors', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getBirthTypes() {
    return this.repositoryService.get('Master/get-birth-types', true).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAnimalSourceTypes() {
    return this.repositoryService
      .get('Master/get-animal-source-types', true)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}

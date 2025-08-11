import { Component } from '@angular/core';
import { LedgerTransactionsComponent } from "../../../super-admin/ledger-transactions/ledger-transactions.component";

@Component({
  selector: 'app-storage-unit-ledgers',
  imports: [LedgerTransactionsComponent],
  templateUrl: './storage-unit-ledgers.component.html',
  styleUrl: './storage-unit-ledgers.component.scss'
})
export class StorageUnitLedgersComponent {

}

import { Component } from '@angular/core';
import { BankLedgerComponent } from "../bank-ledger/bank-ledger.component";

@Component({
  selector: 'app-settings',
  imports: [BankLedgerComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

}

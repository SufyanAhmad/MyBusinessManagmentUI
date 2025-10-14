import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AccountService } from '../../../services/account-service/account.service';

@Component({
  selector: 'app-dairy-farm',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './dairy-farm.component.html',
  styleUrl: './dairy-farm.component.scss',
})
export class DairyFarmComponent {
  status: boolean = false;
  chevron: string = 'chevron-right';
  isAdminExit: boolean = false;
  constructor(private accountService: AccountService) {}
  ngOnInit() {}
  clickEvent() {
    this.status = !this.status;
    this.chevron =
      this.chevron == 'chevron-right' ? 'chevron-left' : 'chevron-right';
  }
  logout() {
    this.accountService.doLogout();
  }
  isSubMenuOpen = false;

  toggleSubMenu(event: Event) {
    event.stopPropagation(); // Prevent parent li click
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }
}

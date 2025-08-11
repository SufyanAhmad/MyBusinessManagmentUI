import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AccountService } from './../../services/account-service/account.service';

@Component({
  selector: 'app-super-admin',
  imports: [RouterLink,RouterLinkActive,RouterOutlet,CommonModule],
templateUrl: './super-admin.component.html',
  styleUrl: './super-admin.component.scss'
})
export class SuperAdminComponent {
  status: boolean = false;
  chevron: string = 'chevron-right';
  isAdminExit: boolean = false;
  constructor(private accountService:AccountService){}
  ngOnInit() {
    if (this.accountService.getRoles().includes("Admin")) {
      this.isAdminExit = true;
    }
  }
  clickEvent() {
    this.status = !this.status;
    this.chevron = this.chevron == 'chevron-right' ? 'chevron-left' : 'chevron-right';
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  businessUnitName:any=null;
  ngOnInit() {
    this.businessUnitName = localStorage.getItem('BS_businessUnit_Name');
  }
}

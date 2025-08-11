import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-poultry-farm',
  imports: [RouterLink,RouterLinkActive,RouterOutlet,CommonModule],
  templateUrl: './poultry-farm.component.html',
  styleUrl: './poultry-farm.component.scss'
})
export class PoultryFarmComponent {
status: boolean = false;
  chevron: string = 'chevron-right';
  clickEvent() {
    this.status = !this.status;
    this.chevron = this.chevron == 'chevron-right' ? 'chevron-left' : 'chevron-right';
  }
}

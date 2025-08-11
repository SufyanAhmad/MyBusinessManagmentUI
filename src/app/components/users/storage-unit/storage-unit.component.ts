import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-storage-unit',
  imports: [RouterLink,RouterLinkActive,RouterOutlet,CommonModule],
  templateUrl: './storage-unit.component.html',
  styleUrl: './storage-unit.component.scss'
})
export class StorageUnitComponent {
  status: boolean = false;
  chevron: string = 'chevron-right';
  clickEvent() {
    this.status = !this.status;
    this.chevron = this.chevron == 'chevron-right' ? 'chevron-left' : 'chevron-right';
  }
}

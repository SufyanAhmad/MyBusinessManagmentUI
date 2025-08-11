
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cold-store',
  imports: [RouterLink,RouterLinkActive,RouterOutlet,CommonModule],
  templateUrl: './cold-store.component.html',
  styleUrl: './cold-store.component.scss'
})
export class ColdStoreComponent {
  status: boolean = false;
  chevron: string = 'chevron-right';
  clickEvent() {
    this.status = !this.status;
    this.chevron = this.chevron == 'chevron-right' ? 'chevron-left' : 'chevron-right';
  }
}

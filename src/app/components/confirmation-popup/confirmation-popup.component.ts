import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-confirmation-popup',
  imports: [ButtonModule,DialogModule],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss'
})
export class ConfirmationPopupComponent {
 @Input() visible: boolean = false;
  @Input() message: string = 'Are you sure?';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  close() {
    this.onCancel.emit();
  }

  confirm() {
    this.onConfirm.emit();
  }
}

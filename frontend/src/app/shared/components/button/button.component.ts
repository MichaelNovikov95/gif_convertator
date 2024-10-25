import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EButtonAction } from "../../../core/enums/button-action.enum";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input()
  text: string = '';
  @Input()
  method: string = '';
  @Input()
  loading: boolean = false;

  @Output()
  onDownloadEmitter: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  onConvertToGifEmitter: EventEmitter<void> = new EventEmitter<void>();

  public onClick(): void {
    if (this.method === EButtonAction.CONVERT) {
      this.onConvertToGifEmitter.emit();
    }

    if (this.method === EButtonAction.DOWNLOAD) {
      this.onDownloadEmitter.emit();
    }
  }
}

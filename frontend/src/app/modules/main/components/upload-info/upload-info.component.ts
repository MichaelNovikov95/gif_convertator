import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-upload-info',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './upload-info.component.html',
  styleUrl: './upload-info.component.scss'
})
export class UploadInfoComponent {
  @Input()
  fileName: string | undefined = undefined;
  @Input()
  errorMessage: string = '';

  @Output()
  removeFileEmitter: EventEmitter<void> = new EventEmitter<void>();

  public removeFile(): void {
    this.removeFileEmitter.emit();
  }
}

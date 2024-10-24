import { Component, Input } from '@angular/core';
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
}

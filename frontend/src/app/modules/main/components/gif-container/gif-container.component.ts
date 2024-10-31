import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

import { IGif } from '../../../../core/interfaces/gif.interface';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-gif-container',
  standalone: true,
  imports: [NgIf, ButtonComponent],
  templateUrl: './gif-container.component.html',
  styleUrl: './gif-container.component.scss',
})
export class GifContainerComponent {
  @Input()
  gif: IGif | null = null;
  @Output() downloadGifEmitter: EventEmitter<string> =
    new EventEmitter<string>();

  public onDownloadGif(): void {
    this.downloadGifEmitter.emit(this.gif?.gifBase64);
  }
}

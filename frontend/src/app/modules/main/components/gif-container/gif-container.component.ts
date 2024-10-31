import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { IGif } from '../../../../core/interfaces/gif.interface';

@Component({
  selector: 'app-gif-container',
  standalone: true,
  imports: [NgIf],
  templateUrl: './gif-container.component.html',
  styleUrl: './gif-container.component.scss',
})
export class GifContainerComponent {
  @Input()
  gif: IGif | null = null;
}

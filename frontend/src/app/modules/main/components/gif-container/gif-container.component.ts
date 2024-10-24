import { Component, Input } from '@angular/core';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-gif-container',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './gif-container.component.html',
  styleUrl: './gif-container.component.scss'
})
export class GifContainerComponent {
  @Input()
  gifUrl: string | null = null;
}

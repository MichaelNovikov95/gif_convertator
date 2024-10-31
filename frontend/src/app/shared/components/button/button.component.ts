import { Component, Input } from '@angular/core';
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
}

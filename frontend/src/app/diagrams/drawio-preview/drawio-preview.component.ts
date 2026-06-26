import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-drawio-preview',
  standalone: true,
  imports: [],
  templateUrl: './drawio-preview.component.html',
  styleUrl: './drawio-preview.component.scss',
})
export class DrawioPreviewComponent {
  @Input() content = '';
}

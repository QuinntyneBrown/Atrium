import { Component, Input } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-markdown-preview',
  standalone: true,
  imports: [MarkdownComponent],
  templateUrl: './markdown-preview.component.html',
  styleUrl: './markdown-preview.component.scss',
})
export class MarkdownPreviewComponent {
  @Input() content = '';
}

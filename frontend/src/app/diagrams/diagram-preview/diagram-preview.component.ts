import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { DiagramSignalrService } from '../diagram-signalr.service';

export interface DiagramSource {
  id: string;
  content: string;
}

/** Debounce window (ms) before a content change is sent to the renderer. */
const RENDER_DEBOUNCE_MS = 400;

@Component({
  selector: 'app-diagram-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagram-preview.component.html',
  styleUrl: './diagram-preview.component.scss',
})
export class DiagramPreviewComponent implements OnDestroy {
  private source: DiagramSource | null = null;
  private readonly sourceChanges = new Subject<DiagramSource>();
  private readonly subscriptions = new Subscription();

  safeSvg: SafeHtml | null = null;
  renderError = false;

  @Input()
  set document(value: DiagramSource | null) {
    const previousId = this.source?.id;
    this.source = value;
    if (value) {
      // Switching to a different document: drop the stale SVG so the placeholder shows
      // until the new diagram renders (otherwise the old document's SVG lingers).
      if (value.id !== previousId) {
        this.safeSvg = null;
        this.renderError = false;
      }
      this.sourceChanges.next(value);
    } else {
      this.safeSvg = null;
    }
  }

  // Subscriptions are wired in the constructor so they are live before Angular
  // assigns the first @Input value (input setters run before ngOnInit).
  constructor(
    private readonly signalr: DiagramSignalrService,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.subscriptions.add(
      this.sourceChanges
        .pipe(debounceTime(RENDER_DEBOUNCE_MS))
        .subscribe(({ id, content }) => {
          this.renderError = false;
          this.signalr.render(id, content).catch(() => {
            this.renderError = true;
          });
        }),
    );

    this.subscriptions.add(
      this.signalr.diagramRendered$
        .pipe(filter((event) => event.documentId === this.source?.id))
        .subscribe((event) => {
          this.renderError = false;
          this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(event.svg);
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

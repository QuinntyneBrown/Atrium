import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMarkdown } from 'ngx-markdown';

import { MarkdownPreviewComponent } from './markdown-preview.component';

describe('MarkdownPreviewComponent', () => {
  let fixture: ComponentFixture<MarkdownPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownPreviewComponent],
      providers: [provideMarkdown()],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownPreviewComponent);
  });

  it('renders markdown content into HTML inside [data-testid="markdown-preview"]', async () => {
    fixture.componentRef.setInput('content', '# Hello Atrium\n\nSome text.');
    fixture.detectChanges();
    // ngx-markdown parses/renders asynchronously, so wait for it to settle.
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.debugElement.query(
      By.css('[data-testid="markdown-preview"]'),
    );
    expect(host).not.toBeNull();

    const heading = host.nativeElement.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toContain('Hello Atrium');
  });
});

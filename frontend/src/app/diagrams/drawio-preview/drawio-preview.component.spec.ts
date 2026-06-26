import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DrawioPreviewComponent } from './drawio-preview.component';

describe('DrawioPreviewComponent', () => {
  let fixture: ComponentFixture<DrawioPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawioPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawioPreviewComponent);
  });

  it('shows the drawio content inside [data-testid="drawio-preview"]', () => {
    fixture.componentRef.setInput('content', '<mxGraphModel>diagram-xml</mxGraphModel>');
    fixture.detectChanges();

    const host = fixture.debugElement.query(
      By.css('[data-testid="drawio-preview"]'),
    );
    expect(host).not.toBeNull();
    expect(host.nativeElement.textContent).toContain('diagram-xml');
  });
});

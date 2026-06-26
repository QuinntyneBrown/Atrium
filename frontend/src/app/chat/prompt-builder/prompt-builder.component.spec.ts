import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { PromptBuilderComponent } from './prompt-builder.component';
import { PromptTemplateService } from '../prompt-template.service';
import { PromptTemplate } from '../prompt-template.model';

const templates: PromptTemplate[] = [
  {
    id: 'pt-1',
    name: 'CHECK',
    mode: 'Check',
    body: 'Check {{document}} against {{document}} and {{style}}.',
    isBuiltIn: true,
    createdOnUtc: '2026-01-01T00:00:00Z',
    modifiedOnUtc: '2026-01-02T00:00:00Z',
  },
];

describe('PromptBuilderComponent', () => {
  let fixture: ComponentFixture<PromptBuilderComponent>;
  let component: PromptBuilderComponent;
  let service: { getAll: jest.Mock; create: jest.Mock };

  beforeEach(async () => {
    service = {
      getAll: jest.fn().mockReturnValue(of(templates)),
      create: jest.fn().mockReturnValue(of(templates[0])),
    };

    await TestBed.configureTestingModule({
      imports: [PromptBuilderComponent],
      providers: [
        provideNoopAnimations(),
        { provide: PromptTemplateService, useValue: service },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PromptBuilderComponent);
    component = fixture.componentInstance;
  });

  function query(testId: string) {
    return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
  }
  function queryAll(testId: string) {
    return fixture.debugElement.queryAll(By.css(`[data-testid="${testId}"]`));
  }

  it('populates templates from getAll', () => {
    fixture.detectChanges();

    expect(service.getAll).toHaveBeenCalledTimes(1);
    expect(component.templates).toEqual(templates);
    expect(query('prompt-template-select')).not.toBeNull();
  });

  it('shows the selected template body', () => {
    fixture.detectChanges();
    component.selectTemplate(templates[0]);
    fixture.detectChanges();

    const body = query('prompt-body');
    expect(body).not.toBeNull();
    expect(body.nativeElement.textContent).toContain('Check {{document}}');
  });

  it('renders one input per unique {{placeholder}}', () => {
    fixture.detectChanges();
    component.selectTemplate(templates[0]);
    fixture.detectChanges();

    const inputs = queryAll('prompt-placeholder');
    expect(inputs).toHaveLength(2); // document, style (deduplicated)
  });

  it('assembles the body with filled placeholders and emits on Run', () => {
    fixture.detectChanges();
    component.selectTemplate(templates[0]);
    fixture.detectChanges();

    component.values['document'] = 'ADR-001';
    component.values['style'] = '42010';

    let assembled: string | undefined;
    component.assembled.subscribe((value) => (assembled = value));

    query('prompt-run').nativeElement.click();

    expect(assembled).toBe('Check ADR-001 against ADR-001 and 42010.');
  });

  it('attaches a dropped document into the {{document}} context and shows a chip', () => {
    fixture.detectChanges();
    component.selectTemplate(templates[0]);

    component.attachDocument({ name: 'ADR-001.md', content: '# Decision' });
    fixture.detectChanges();

    expect(component.values['document']).toBe('# Decision');
    const chip = query('attached-document');
    expect(chip).not.toBeNull();
    expect(chip.nativeElement.textContent).toContain('ADR-001.md');
  });

  it('clears attached documents when the template is (re)selected', () => {
    fixture.detectChanges();
    component.selectTemplate(templates[0]);
    component.attachDocument({ name: 'ADR-001.md', content: '# Decision' });
    fixture.detectChanges();
    expect(component.attached).toContain('ADR-001.md');

    component.selectTemplate(templates[0]);
    fixture.detectChanges();

    expect(component.attached).toEqual([]);
    expect(query('attached-document')).toBeNull();
  });
});

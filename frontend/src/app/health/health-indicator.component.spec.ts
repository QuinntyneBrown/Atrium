import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { HealthIndicatorComponent } from './health-indicator.component';
import { HealthService } from '../core/health.service';

describe('HealthIndicatorComponent', () => {
  let fixture: ComponentFixture<HealthIndicatorComponent>;
  let healthService: { getHealth: jest.Mock };

  beforeEach(async () => {
    healthService = {
      getHealth: jest.fn().mockReturnValue(of({ status: 'Healthy' })),
    };

    await TestBed.configureTestingModule({
      imports: [HealthIndicatorComponent],
      providers: [
        provideNoopAnimations(),
        { provide: HealthService, useValue: healthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthIndicatorComponent);
    fixture.detectChanges();
  });

  it('requests the backend health on init', () => {
    expect(healthService.getHealth).toHaveBeenCalledTimes(1);
  });

  it('renders the status text inside the [data-testid="health-status"] element', () => {
    const statusEl = fixture.debugElement.query(
      By.css('[data-testid="health-status"]'),
    );

    expect(statusEl).not.toBeNull();
    expect(statusEl.nativeElement.textContent).toContain('Healthy');
  });
});

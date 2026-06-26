import { Component, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

import { HealthService } from '../core/health.service';

@Component({
  selector: 'app-health-indicator',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './health-indicator.component.html',
  styleUrl: './health-indicator.component.scss',
})
export class HealthIndicatorComponent implements OnInit {
  status = '';

  constructor(private readonly health: HealthService) {}

  ngOnInit(): void {
    this.health.getHealth().subscribe((health) => {
      this.status = health.status;
    });
  }
}

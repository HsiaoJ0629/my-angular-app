import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PROFESSIONAL_SUMMARY } from '../../../core/site/profile.data';

@Component({
  selector: 'app-summary',
  imports: [MatCardModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  protected readonly summary = PROFESSIONAL_SUMMARY;
}

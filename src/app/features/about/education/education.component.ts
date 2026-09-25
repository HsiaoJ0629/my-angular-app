import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EDUCATION } from '../../../core/site/profile.data';

@Component({
  selector: 'app-education',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationComponent {
  protected readonly education = EDUCATION;
}

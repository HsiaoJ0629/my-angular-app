import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EducationComponent } from './education/education.component';
import { HistoryComponent } from './history/history.component';
import { SkillSelection } from './skill-selection.model';
import { SkillsComponent } from './skills/skills.component';
import { SummaryComponent } from './summary/summary.component';

@Component({
  selector: 'app-about',
  imports: [SummaryComponent, SkillsComponent, HistoryComponent, EducationComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  /**
   * The About page owns the selected skill; `app-skills` renders it and
   * `app-history` reacts to it, keeping data flowing in one direction.
   */
  protected readonly selection = signal<SkillSelection | null>(null);

  /** Selecting the already-selected skill, or clearing it, removes the filter. */
  protected onSelectSkill(skill: string | null): void {
    this.selection.update((current) => {
      if (skill === null || current?.skill === skill) {
        return null;
      }
      return { skill, sequence: (current?.sequence ?? 0) + 1 };
    });
  }
}

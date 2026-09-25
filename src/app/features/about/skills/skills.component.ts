import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { SKILL_GROUPS } from '../../../core/site/profile.data';

@Component({
  selector: 'app-skills',
  imports: [MatCardModule, MatChipsModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  /** Currently selected skill, owned by the parent page. */
  readonly selected = input<string | null>(null);

  /** Emits the newly selected skill, or `null` when the selection is cleared. */
  readonly selectSkill = output<string | null>();

  protected readonly skillGroups = SKILL_GROUPS;
}

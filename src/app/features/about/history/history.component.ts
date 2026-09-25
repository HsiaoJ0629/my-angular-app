import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { WORK_HISTORY } from '../../../core/site/profile.data';
import { WorkHistory } from '../../../core/site/profile.model';
import { SkillSelection } from '../skill-selection.model';

/** A role plus whether it matches the currently selected skill. */
interface RoleView {
  readonly role: WorkHistory;
  readonly matchesSelection: boolean;
  readonly dateRange: string;
}

@Component({
  selector: 'app-history',
  imports: [MatCardModule, MatExpansionModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // `:increment` re-runs the flash every time `flashKey` goes up, which avoids
    // the timeout-and-reset dance needed to restart a plain CSS animation.
    trigger('flash', [
      transition(':increment', [
        animate(
          '1.6s ease-in-out',
          keyframes([
            style({ boxShadow: '0 0 0 rgba(158, 202, 255, 0)', offset: 0 }),
            style({ boxShadow: '0 4px 16px rgba(158, 202, 255, 0.75)', offset: 0.5 }),
            style({ boxShadow: '0 0 0 rgba(158, 202, 255, 0)', offset: 1 }),
          ]),
        ),
      ]),
    ]),
  ],
})
export class HistoryComponent {
  /** The skill selected on the About page, or `null` when nothing is selected. */
  readonly selection = input<SkillSelection | null>(null);

  protected readonly roles = computed<RoleView[]>(() => {
    const skill = this.selection()?.skill ?? null;
    return WORK_HISTORY.map((role) => ({
      role,
      matchesSelection: skill !== null && role.skills.includes(skill),
      dateRange: `${role.startYear} - ${role.endYear ?? 'Present'}`,
    }));
  });

  /** True when the selected skill spans every role — worth calling out. */
  protected readonly isHighlighted = computed(
    () => this.selection() !== null && this.roles().every((view) => view.matchesSelection),
  );

  /** True when the selected skill is on the skills list but in none of the roles. */
  protected readonly isUnmatched = computed(
    () => this.selection() !== null && this.roles().every((view) => !view.matchesSelection),
  );

  /**
   * Feeds the `:increment` animation. Staying at 0 while not highlighted means
   * the flash only replays when a new selection highlights every role.
   */
  protected readonly flashKey = computed(() =>
    this.isHighlighted() ? (this.selection()?.sequence ?? 0) : 0,
  );
}

/**
 * A skill chosen on the About page.
 *
 * `sequence` increments on every distinct selection so downstream components can
 * react to "the user picked again" even when the same skill is re-selected. It
 * turns an inherently event-like interaction into derivable state.
 */
export interface SkillSelection {
  readonly skill: string;
  readonly sequence: number;
}

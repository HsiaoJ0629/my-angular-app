/** A named group of related technologies shown on the About page. */
export interface SkillGroup {
  readonly category: string;
  readonly items: readonly string[];
}

/** One résumé bullet: the area of work, then what was done and what it achieved. */
export interface Achievement {
  readonly area: string;
  readonly detail: string;
}

/** One role in the work history timeline. */
export interface WorkHistory {
  readonly company: string;
  readonly role: string;
  readonly startYear: number;
  /** `null` means the role is current. */
  readonly endYear: number | null;
  readonly achievements: readonly Achievement[];
  /** Skills used in this role; must match entries in `SKILL_GROUPS`. */
  readonly skills: readonly string[];
}

/** A capability highlighted on the home page. */
export interface Capability {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

/** A headline number backed by a specific piece of work. */
export interface ImpactMetric {
  readonly value: string;
  readonly label: string;
  /** Which project produced the number, so it is never a bare claim. */
  readonly source: string;
}

/** A qualification shown on the About page. */
export interface Education {
  readonly degree: string;
  readonly institution: string;
  readonly focusAreas: readonly string[];
  readonly coursework: string;
}

/**
 * A project written up as problem → approach → impact, the structure
 * interviewers use to probe ownership and judgement.
 */
export interface CaseStudy {
  /** Stable, URL-safe id used as the page anchor. */
  readonly slug: string;
  readonly title: string;
  readonly company: string;
  readonly icon: string;
  /** One-line summary for cards on the home page. */
  readonly summary: string;
  readonly problem: string;
  readonly approach: readonly string[];
  readonly impact: readonly string[];
  readonly stack: readonly string[];
  /** Optional in-site route that demonstrates the technique live. */
  readonly demoRoute?: string;
  /** Shown on the home page when true. */
  readonly featured?: boolean;
}

import { routes } from '../../app.routes';
import { CASE_STUDIES, IMPACT_METRICS, SKILL_GROUPS, WORK_HISTORY } from './profile.data';

/**
 * The profile is hand-edited content, so these checks catch the mistakes that
 * would otherwise only show up as a silently broken page.
 */
describe('profile data', () => {
  const allSkills = SKILL_GROUPS.flatMap((group) => group.items);

  it('lists each skill once', () => {
    expect(new Set(allSkills).size).toBe(allSkills.length);
  });

  it('only tags roles with skills that appear on the skills list', () => {
    WORK_HISTORY.forEach((role) =>
      role.skills.forEach((skill) =>
        expect(allSkills).withContext(`${role.company}: ${skill}`).toContain(skill),
      ),
    );
  });

  it('orders work history newest first', () => {
    const starts = WORK_HISTORY.map((role) => role.startYear);

    expect(starts).toEqual([...starts].sort((a, b) => b - a));
  });

  it('gives every case study a unique, URL-safe slug for deep links', () => {
    const slugs = CASE_STUDIES.map((study) => study.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9-]+$/));
  });

  it('only links case studies to demo routes that exist', () => {
    const paths = routes.map((route) => `/${route.path}`);

    CASE_STUDIES.filter((study) => study.demoRoute).forEach((study) =>
      expect(paths).withContext(study.slug).toContain(study.demoRoute!),
    );
  });

  it('features between one and three case studies on the home page', () => {
    const featured = CASE_STUDIES.filter((study) => study.featured).length;

    expect(featured).toBeGreaterThan(0);
    expect(featured).toBeLessThanOrEqual(3);
  });

  it('attributes every headline metric to a source', () => {
    IMPACT_METRICS.forEach((metric) =>
      expect(metric.source).withContext(metric.label).toBeTruthy(),
    );
  });
});

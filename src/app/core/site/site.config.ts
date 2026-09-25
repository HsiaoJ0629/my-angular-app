/**
 * Single source of truth for personal and site-wide metadata.
 *
 * Every component, SEO tag and structured-data block reads from here, so
 * updating a link or a headline is a one-line change rather than a grep.
 */
export const SITE = {
  name: 'Arthur Hsiao',
  role: 'Senior Full Stack Developer',
  tagline:
    'Senior Full Stack Developer with 6+ years building secure, scalable fintech and healthcare ' +
    'systems in Angular, Spring Boot and Node.js.',
  yearsExperience: 6,
  email: 'arthur.hsiao0629@gmail.com',
  linkedInUrl: 'https://www.linkedin.com/in/arthur-hsiao-2874bb172/',
  gitHubUrl: 'https://github.com/hsiaoj0629',
  /** Source of this site, linked from demos so reviewers can read the code. */
  repoUrl: 'https://github.com/HsiaoJ0629/my-angular-app',
  location: 'Melbourne, Australia',
  /** Absolute origin + base href of the deployed site, used for canonical/OG URLs. */
  baseUrl: 'https://hsiaoj0629.github.io/my-angular-app',
} as const;

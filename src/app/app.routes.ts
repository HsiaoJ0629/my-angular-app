import { Routes } from '@angular/router';
import { SITE } from './core/site/site.config';

/**
 * Every feature is lazy-loaded so the initial bundle only contains the shell and
 * the landing page. `title` and `data.description` are consumed by
 * `SeoTitleStrategy` to set per-page document metadata.
 */
export const routes: Routes = [
  {
    path: 'home',
    title: 'Home',
    data: { description: SITE.tagline },
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    title: 'About',
    data: {
      description:
        `Professional summary, technical skills, work history and education for ${SITE.name}, ` +
        'covering Angular, Spring Boot, Node.js, PostgreSQL, Docker and AWS.',
    },
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'projects',
    title: 'Projects',
    data: {
      description:
        'Case studies: a loan origination platform, AWS Textract invoice automation, MFA, ' +
        'open-banking integrations and a healthcare system migration.',
    },
    loadComponent: () =>
      import('./features/projects/projects.component').then((m) => m.ProjectsComponent),
  },
  {
    path: 'demo',
    title: 'Demo',
    data: {
      description:
        'An interactive product management demo built with Angular Material: server-side ' +
        'search, sorting, pagination and CRUD against a REST API.',
    },
    loadComponent: () => import('./features/demo/demo.component').then((m) => m.DemoComponent),
  },
  {
    path: 'mfa-demo',
    title: 'MFA demo',
    data: {
      description:
        'A dependency-free TOTP (RFC 6238) implementation on the Web Crypto API, with clock-drift ' +
        'tolerance, replay protection and brute-force lockout.',
    },
    loadComponent: () =>
      import('./features/mfa-demo/mfa-demo.component').then((m) => m.MfaDemoComponent),
  },
  {
    path: 'contact',
    title: 'Contact',
    data: { description: `Get in touch with ${SITE.name} by email, LinkedIn or GitHub.` },
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '**',
    title: 'Page not found',
    data: { description: 'The page you were looking for does not exist.' },
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];

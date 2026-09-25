import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CAPABILITIES, CASE_STUDIES, IMPACT_METRICS } from '../../core/site/profile.data';
import { SITE } from '../../core/site/site.config';

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly site = SITE;
  protected readonly capabilities = CAPABILITIES;
  protected readonly metrics = IMPACT_METRICS;
  protected readonly featured = CASE_STUDIES.filter((study) => study.featured);

  protected readonly portfolioDescription =
    'This site is built the way I build production front ends: Angular 19 with standalone ' +
    'components and signals, prerendered for SEO, lazy-loaded per route, accessible by ' +
    'default, and gated by tests, lint and bundle budgets in CI on every push.';

  protected readonly portfolioTech: readonly string[] = [
    'Angular 19 with server-side rendering',
    'Standalone components, signals and OnPush',
    'Lazy-loaded routes and per-page SEO metadata',
    'Angular Material design system',
    'Typed RESTful API integration with RxJS',
    'Dependency-free TOTP on the Web Crypto API',
    'Unit tests against RFC test vectors, ESLint and CI',
  ];
}

import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SITE } from '../site/site.config';
import { PageSeo, SeoService } from './seo.service';
import { SeoTitleStrategy } from './seo-title.strategy';

/** Minimal stand-in for the nested `ActivatedRouteSnapshot` chain. */
function snapshotWith(url: string, data: Record<string, unknown>[]): RouterStateSnapshot {
  const nodes = data.map((entry) => ({ data: entry, firstChild: null as unknown }));
  nodes.forEach((node, index) => {
    node.firstChild = nodes[index + 1] ?? null;
  });
  return { url, root: nodes[0] } as unknown as RouterStateSnapshot;
}

describe('SeoTitleStrategy', () => {
  let strategy: SeoTitleStrategy;
  let seo: jasmine.SpyObj<SeoService>;

  beforeEach(() => {
    seo = jasmine.createSpyObj<SeoService>('SeoService', ['update']);
    TestBed.configureTestingModule({
      providers: [
        { provide: SeoService, useValue: seo },
        { provide: TitleStrategy, useClass: SeoTitleStrategy },
      ],
    });
    strategy = TestBed.inject(TitleStrategy) as SeoTitleStrategy;
    spyOn(strategy, 'buildTitle').and.returnValue('About');
  });

  function lastCall(): PageSeo {
    return seo.update.calls.mostRecent().args[0];
  }

  it('passes the resolved route title and description to the SEO service', () => {
    strategy.updateTitle(snapshotWith('/about', [{}, { description: 'About me.' }]));

    expect(lastCall()).toEqual({ title: 'About', description: 'About me.', path: '/about' });
  });

  it('prefers the deepest route description so child routes can override', () => {
    strategy.updateTitle(
      snapshotWith('/about', [{ description: 'parent' }, { description: 'child' }]),
    );

    expect(lastCall().description).toBe('child');
  });

  it('falls back to the site tagline when no route supplies a description', () => {
    strategy.updateTitle(snapshotWith('/about', [{}, {}]));

    expect(lastCall().description).toBe(SITE.tagline);
  });

  it('strips query strings and fragments from the canonical path', () => {
    strategy.updateTitle(snapshotWith('/demo?page=2#results', [{ description: 'demo' }]));

    expect(lastCall().path).toBe('/demo');
  });
});

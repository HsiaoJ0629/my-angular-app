import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../site/site.config';

/** Page-level metadata resolved from the active route. */
export interface PageSeo {
  readonly title: string;
  readonly description: string;
  /** Route path without a leading slash, e.g. `'about'`. */
  readonly path: string;
}

/**
 * Applies per-page SEO metadata: document title, description, canonical link and
 * Open Graph / Twitter card tags.
 *
 * Runs on the server during prerendering, so crawlers and link unfurlers see the
 * correct tags in the initial HTML rather than after hydration.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(page: PageSeo): void {
    const fullTitle = `${page.title} | ${SITE.name} — ${SITE.role}`;
    const url = this.canonicalUrl(page.path);

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: page.description });

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: `${SITE.name} — Portfolio` });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });

    this.setCanonical(url);
  }

  private canonicalUrl(path: string): string {
    const normalized = path.replace(/^\/+/, '');
    return normalized ? `${SITE.baseUrl}/${normalized}` : SITE.baseUrl;
  }

  /** Creates the `<link rel="canonical">` element on first use, then reuses it. */
  private setCanonical(url: string): void {
    const head = this.document.head;
    if (!head) {
      return;
    }

    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}

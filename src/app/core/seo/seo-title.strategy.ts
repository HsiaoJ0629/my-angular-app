import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SITE } from '../site/site.config';
import { SeoService } from './seo.service';

/** Route `data` keys consumed by {@link SeoTitleStrategy}. */
export interface SeoRouteData {
  readonly description: string;
}

/**
 * Router hook that applies SEO metadata on every successful navigation.
 *
 * Angular calls this once per navigation with the resolved router state, which
 * makes it the natural place to centralise metadata instead of repeating
 * `Title`/`Meta` calls in each component.
 */
@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? SITE.role;
    const description = this.deepestDescription(snapshot) ?? SITE.tagline;
    const path = snapshot.url.split(/[?#]/)[0];

    this.seo.update({ title, description, path });
  }

  /** Walks to the deepest activated route so child routes can override the description. */
  private deepestDescription(snapshot: RouterStateSnapshot): string | undefined {
    let route = snapshot.root;
    let description: string | undefined;

    while (route) {
      const data = route.data as Partial<SeoRouteData>;
      if (typeof data.description === 'string') {
        description = data.description;
      }
      route = route.firstChild!;
    }

    return description;
  }
}

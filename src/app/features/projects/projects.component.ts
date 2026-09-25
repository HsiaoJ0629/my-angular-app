import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CASE_STUDIES } from '../../core/site/profile.data';

/** Space left above a deep-linked case study. */
const SCROLL_MARGIN_PX = 16;

@Component({
  selector: 'app-projects',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  protected readonly caseStudies = CASE_STUDIES;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const fragment = inject(ActivatedRoute).snapshot.fragment;

    // The app scrolls an inner container, which the router's anchor scrolling
    // does not reach, so deep links like `/projects#mfa` are handled here.
    afterNextRender(() => {
      const target = fragment
        ? host.nativeElement.querySelector<HTMLElement>(`#${CSS.escape(fragment)}`)
        : null;
      if (target) {
        scrollToElement(target);
      }
    });
  }
}

/**
 * Scrolls only the nearest scrollable ancestor. `scrollIntoView` would also
 * scroll every outer container, shifting the fixed navigation out of view.
 */
function scrollToElement(target: HTMLElement): void {
  let container = target.parentElement;
  while (container && !isScrollable(container)) {
    container = container.parentElement;
  }
  if (!container) {
    return;
  }
  const offset = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
  container.scrollTo({ top: container.scrollTop + offset - SCROLL_MARGIN_PX });
}

function isScrollable(element: HTMLElement): boolean {
  const overflowY = getComputedStyle(element).overflowY;
  return (
    (overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight > element.clientHeight
  );
}

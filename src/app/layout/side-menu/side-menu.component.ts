import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';

interface NavLink {
  readonly path: string;
  readonly label: string;
  readonly icon: string;
}

/** Scroll distance, in pixels, after which the "back to top" button appears. */
const GO_TOP_THRESHOLD_PX = 400;

@Component({
  selector: 'app-side-menu',
  imports: [
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly sidenav = viewChild.required<MatSidenav>('sidenav');
  private readonly contentRef = viewChild.required<ElementRef<HTMLElement>>('contentRef');

  protected readonly links: readonly NavLink[] = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/about', label: 'About me', icon: 'person' },
    { path: '/projects', label: 'Projects', icon: 'work' },
    { path: '/demo', label: 'Data table demo', icon: 'table_view' },
    { path: '/mfa-demo', label: 'MFA demo', icon: 'verified_user' },
    { path: '/contact', label: 'Contact me', icon: 'mail' },
  ];

  protected readonly showGoTop = signal(false);

  /**
   * On handset widths the drawer overlays the content, so it starts closed and
   * closes again after each navigation.
   */
  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.onNavigated());
  }

  toggle(): void {
    void this.sidenav().toggle();
  }

  protected onContentScroll(): void {
    this.showGoTop.set(this.contentRef().nativeElement.scrollTop > GO_TOP_THRESHOLD_PX);
  }

  protected goToTop(): void {
    this.contentRef().nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected onNavLinkClick(): void {
    if (this.isHandset()) {
      void this.sidenav().close();
    }
  }

  /**
   * The app scrolls an inner container rather than the document, so the router's
   * own scroll restoration does not apply — reset the container manually.
   *
   * Router events also fire while prerendering, where the server DOM has no
   * `scrollTo`, so this is browser-only.
   */
  private onNavigated(): void {
    if (this.isBrowser) {
      this.contentRef().nativeElement.scrollTo({ top: 0, behavior: 'auto' });
    }
    this.showGoTop.set(false);
  }
}

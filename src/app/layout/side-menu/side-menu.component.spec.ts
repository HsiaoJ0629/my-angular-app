import { ChangeDetectionStrategy, Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router, provideRouter } from '@angular/router';
import { SideMenuComponent } from './side-menu.component';

@Component({
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class BlankComponent {}

describe('SideMenuComponent', () => {
  let fixture: ComponentFixture<SideMenuComponent>;
  let element: HTMLElement;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([
          { path: 'home', component: BlankComponent },
          { path: 'about', component: BlankComponent },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SideMenuComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function navLinks(): HTMLAnchorElement[] {
    return Array.from(element.querySelectorAll<HTMLAnchorElement>('mat-nav-list a'));
  }

  function content(): HTMLElement {
    return element.querySelector<HTMLElement>('.content')!;
  }

  it('renders navigation as anchors with real hrefs', () => {
    expect(navLinks().map((link) => link.getAttribute('href'))).toEqual([
      '/home',
      '/about',
      '/projects',
      '/demo',
      '/mfa-demo',
      '/contact',
    ]);
  });

  it('marks the active route with aria-current for assistive technology', fakeAsync(() => {
    router.navigate(['/about']);
    tick();
    fixture.detectChanges();

    const current = navLinks().filter((link) => link.getAttribute('aria-current') === 'page');
    expect(current.length).toBe(1);
    expect(current[0].getAttribute('href')).toBe('/about');
  }));

  it('exposes a labelled main landmark for the skip link to target', () => {
    const main = element.querySelector('main#main-content');

    expect(main).toBeTruthy();
    expect(main?.tagName.toLowerCase()).toBe('main');
  });

  it('hides the back-to-top button until the content is scrolled', () => {
    expect(element.querySelector('.go-top-btn')).toBeNull();
  });

  it('shows the back-to-top button once scrolled past the threshold', () => {
    Object.defineProperty(content(), 'scrollTop', { value: 800, configurable: true });
    content().dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(element.querySelector('.go-top-btn')).toBeTruthy();
  });

  it('scrolls the content container back to the top on request', () => {
    Object.defineProperty(content(), 'scrollTop', { value: 800, configurable: true });
    content().dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    const scrollTo: jasmine.Spy = spyOn(content(), 'scrollTo');

    element.querySelector<HTMLButtonElement>('.go-top-btn')!.click();

    expect(scrollTo).toHaveBeenCalledWith(jasmine.objectContaining({ top: 0 }));
  });

  it('resets the scroll position when navigating to a new page', fakeAsync(() => {
    const scrollTo: jasmine.Spy = spyOn(content(), 'scrollTo');

    router.navigate(['/about']);
    tick();
    fixture.detectChanges();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  }));

  it('does not touch the DOM scroll API while prerendering on the server', fakeAsync(() => {
    // The server DOM has no `scrollTo`; calling it during prerender throws.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [SideMenuComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([{ path: 'about', component: BlankComponent }]),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    const serverFixture = TestBed.createComponent(SideMenuComponent);
    serverFixture.detectChanges();
    const serverContent = (serverFixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '.content',
    )!;
    const scrollTo: jasmine.Spy = spyOn(serverContent, 'scrollTo');

    TestBed.inject(Router).navigate(['/about']);
    tick();
    serverFixture.detectChanges();

    expect(scrollTo).not.toHaveBeenCalled();
  }));

  it('hides the back-to-top button again after navigating', fakeAsync(() => {
    Object.defineProperty(content(), 'scrollTop', { value: 800, configurable: true });
    content().dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(element.querySelector('.go-top-btn')).toBeTruthy();

    router.navigate(['/about']);
    tick();
    fixture.detectChanges();

    expect(element.querySelector('.go-top-btn')).toBeNull();
  }));
});

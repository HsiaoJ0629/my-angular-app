import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { SideMenuComponent } from './layout/side-menu/side-menu.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();
  });

  it('creates the application shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the header and the navigation drawer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-header')).toBeTruthy();
    expect(element.querySelector('app-side-menu')).toBeTruthy();
  });

  it('offers a skip link that targets the main content region', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const skipLink = element.querySelector<HTMLAnchorElement>('.skip-link');
    expect(skipLink?.getAttribute('href')).toBe('#main-content');
    expect(element.querySelector('#main-content')).toBeTruthy();
  });

  it('toggles the drawer when the header requests it', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const sideMenu = fixture.debugElement.query(
      (node) => node.componentInstance instanceof SideMenuComponent,
    ).componentInstance as SideMenuComponent;
    const toggle = spyOn(sideMenu, 'toggle');

    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.menu-button')!.click();

    expect(toggle).toHaveBeenCalled();
  });
});

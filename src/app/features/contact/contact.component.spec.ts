import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SITE } from '../../core/site/site.config';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let fixture: ComponentFixture<ContactComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ContactComponent] }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function links(): HTMLAnchorElement[] {
    return Array.from(element.querySelectorAll<HTMLAnchorElement>('a.contact-item'));
  }

  it('renders every channel as a real link rather than a click handler', () => {
    expect(links().length).toBe(3);
    links().forEach((link) => expect(link.getAttribute('href')).toBeTruthy());
  });

  it('builds a mailto link with an encoded subject', () => {
    const href = links()[0].getAttribute('href')!;

    expect(href).toBe(`mailto:${SITE.email}?subject=Portfolio%20enquiry`);
  });

  it('links to the configured LinkedIn and GitHub profiles', () => {
    const hrefs = links().map((link) => link.getAttribute('href'));

    expect(hrefs).toContain(SITE.linkedInUrl);
    expect(hrefs).toContain(SITE.gitHubUrl);
  });

  it('opens external profiles safely in a new tab', () => {
    const external = links().filter((link) => link.target === '_blank');

    expect(external.length).toBe(2);
    external.forEach((link) => expect(link.rel).toBe('noopener noreferrer'));
  });

  it('keeps the mailto link in the same tab', () => {
    expect(links()[0].target).toBe('');
  });

  it('warns screen reader users that external links open a new tab', () => {
    const notices = element.querySelectorAll('a[target="_blank"] .visually-hidden');

    expect(notices.length).toBe(2);
    notices.forEach((notice) => expect(notice.textContent).toContain('new tab'));
  });
});

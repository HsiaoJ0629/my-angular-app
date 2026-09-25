import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { CASE_STUDIES } from '../../core/site/profile.data';
import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  function create(fragment: string | null = null): ComponentFixture<ProjectsComponent> {
    TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { fragment } } },
      ],
    });
    const fixture = TestBed.createComponent(ProjectsComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renders every case study with an anchor matching its slug', () => {
    const element = create().nativeElement as HTMLElement;
    const ids = Array.from(element.querySelectorAll('.case-study')).map((card) => card.id);

    expect(ids).toEqual(CASE_STUDIES.map((study) => study.slug));
  });

  it('shows problem, approach and impact for each case study', () => {
    const element = create().nativeElement as HTMLElement;
    const headings = Array.from(element.querySelectorAll('.case-study h3')).map((heading) =>
      heading.textContent?.trim(),
    );

    expect(headings.filter((heading) => heading === 'Impact').length).toBe(CASE_STUDIES.length);
  });

  it('links case studies with a live demo to it', () => {
    const element = create().nativeElement as HTMLElement;
    const withDemo = CASE_STUDIES.filter((study) => study.demoRoute);
    const links = element.querySelectorAll('mat-card-actions a');

    expect(links.length).toBe(withDemo.length);
    expect(links[0].getAttribute('href')).toBe(withDemo[0].demoRoute!);
  });

  it('scrolls a deep-linked case study into view within its scroll container', async () => {
    const scroller = document.createElement('div');
    scroller.style.cssText = 'height: 200px; overflow-y: auto;';
    document.body.appendChild(scroller);

    TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { fragment: 'mfa' } } },
      ],
    });
    const fixture = TestBed.createComponent(ProjectsComponent);
    scroller.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();

    const target = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('#mfa')!;
    const offset = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top;

    expect(scroller.scrollTop).toBeGreaterThan(0);
    expect(Math.abs(offset - 16)).toBeLessThan(2);

    fixture.destroy();
    scroller.remove();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { WORK_HISTORY } from '../../../core/site/profile.data';
import { HistoryComponent } from './history.component';

describe('HistoryComponent', () => {
  let fixture: ComponentFixture<HistoryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function select(skill: string, sequence = 1): void {
    fixture.componentRef.setInput('selection', { skill, sequence });
    fixture.detectChanges();
  }

  function expandedCompanies(): string[] {
    return Array.from(element.querySelectorAll('mat-expansion-panel'))
      .filter((panel) => panel.querySelector('.mat-expanded'))
      .map((panel) => (panel.querySelector('mat-panel-title')?.textContent ?? '').trim());
  }

  it('renders every role from the profile data', () => {
    expect(element.querySelectorAll('mat-expansion-panel').length).toBe(WORK_HISTORY.length);
  });

  it('shows "Present" for a role with no end year', () => {
    expect(element.textContent).toContain('2022 - Present');
  });

  it('starts with every panel collapsed', () => {
    expect(expandedCompanies()).toEqual([]);
  });

  it('expands only the roles that used the selected skill', () => {
    select('Express.js');

    expect(expandedCompanies()).toEqual(['Sterling Systems Pty. Ltd.']);
  });

  it('highlights the card when every role used the selected skill', () => {
    select('Angular');

    expect(element.querySelector('mat-card')?.classList).toContain('history-card');
  });

  it('does not highlight when only some roles used the skill', () => {
    select('Java');

    expect(element.querySelector('mat-card')?.classList).not.toContain('history-card');
  });

  it('collapses everything again when the selection is cleared', () => {
    select('Angular');
    fixture.componentRef.setInput('selection', null);
    fixture.detectChanges();

    expect(expandedCompanies()).toEqual([]);
    expect(element.querySelector('mat-card')?.classList).not.toContain('history-card');
  });

  it('labels each achievement with its area of work', () => {
    const areas = Array.from(element.querySelectorAll('.achievement-area')).map((node) =>
      node.textContent?.trim(),
    );

    expect(areas).toContain('Technical leadership:');
    expect(areas.length).toBe(
      WORK_HISTORY.reduce((total, role) => total + role.achievements.length, 0),
    );
  });

  it('explains when a selected skill is not tied to any role', () => {
    select('MongoDB');

    expect(expandedCompanies()).toEqual([]);
    expect(element.querySelector('.unmatched')?.textContent).toContain('MongoDB');
  });

  it('does not show the unmatched note when a role matches', () => {
    select('Java');

    expect(element.querySelector('.unmatched')).toBeNull();
  });

  it('keeps the role title in the DOM for narrow layouts and search engines', () => {
    expect(element.querySelector('.role-title')?.textContent).toContain('Developer');
  });
});

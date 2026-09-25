import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AboutComponent } from './about.component';
import { HistoryComponent } from './history/history.component';
import { SkillsComponent } from './skills/skills.component';

describe('AboutComponent', () => {
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();
  });

  function skills(): SkillsComponent {
    return fixture.debugElement.children[0].query(
      (node) => node.componentInstance instanceof SkillsComponent,
    ).componentInstance;
  }

  function history(): HistoryComponent {
    return fixture.debugElement.query((node) => node.componentInstance instanceof HistoryComponent)
      .componentInstance;
  }

  it('passes a selected skill down to the work history', () => {
    skills().selectSkill.emit('Angular');
    fixture.detectChanges();

    expect(history().selection()?.skill).toBe('Angular');
  });

  it('clears the selection when the same skill is chosen twice', () => {
    skills().selectSkill.emit('Angular');
    fixture.detectChanges();
    skills().selectSkill.emit('Angular');
    fixture.detectChanges();

    expect(history().selection()).toBeNull();
  });

  it('clears the selection when the skill list reports a deselect', () => {
    skills().selectSkill.emit('Angular');
    fixture.detectChanges();
    skills().selectSkill.emit(null);
    fixture.detectChanges();

    expect(history().selection()).toBeNull();
  });

  it('increments the sequence on each new selection so repeats are distinguishable', () => {
    skills().selectSkill.emit('Angular');
    fixture.detectChanges();
    const first = history().selection()!.sequence;

    skills().selectSkill.emit('Java');
    fixture.detectChanges();

    expect(history().selection()!.sequence).toBeGreaterThan(first);
  });

  it('reflects the current selection back into the skill list', () => {
    skills().selectSkill.emit('Docker');
    fixture.detectChanges();

    expect(skills().selected()).toBe('Docker');
  });
});

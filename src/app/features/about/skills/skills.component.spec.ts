import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipListboxHarness } from '@angular/material/chips/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SKILL_GROUPS } from '../../../core/site/profile.data';
import { SkillsComponent } from './skills.component';

describe('SkillsComponent', () => {
  let fixture: ComponentFixture<SkillsComponent>;
  let element: HTMLElement;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    element = fixture.nativeElement as HTMLElement;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('renders a group per skill category', () => {
    expect(element.querySelectorAll('.skill-group').length).toBe(SKILL_GROUPS.length);
  });

  it('renders every skill as a selectable option', async () => {
    const listboxes = await loader.getAllHarnesses(MatChipListboxHarness);
    const rendered = (await Promise.all(listboxes.map((listbox) => listbox.getChips()))).reduce(
      (total, chips) => total + chips.length,
      0,
    );
    const expected = SKILL_GROUPS.reduce((total, group) => total + group.items.length, 0);

    expect(rendered).toBe(expected);
  });

  it('emits the skill when an option is chosen', async () => {
    const emitted: (string | null)[] = [];
    fixture.componentInstance.selectSkill.subscribe((skill) => emitted.push(skill));

    const listbox = await loader.getHarness(MatChipListboxHarness);
    await listbox.selectChips({ text: 'Java' });

    expect(emitted).toEqual(['Java']);
  });

  it('marks the skill supplied by the parent as selected', async () => {
    fixture.componentRef.setInput('selected', 'Java');
    fixture.detectChanges();

    const listbox = await loader.getHarness(MatChipListboxHarness);
    const selected = await Promise.all(
      (await listbox.getChips()).map(async (chip) =>
        (await chip.isSelected()) ? chip.getText() : null,
      ),
    );

    expect((await Promise.all(selected)).filter(Boolean)).toEqual(['Java']);
  });

  it('allows only one skill to be selected at a time', async () => {
    const listbox = await loader.getHarness(MatChipListboxHarness);

    expect(await listbox.isMultiple()).toBeFalse();
  });

  it('labels each chip group for assistive technology', () => {
    const labels = Array.from(element.querySelectorAll('mat-chip-listbox')).map((list) =>
      list.getAttribute('aria-label'),
    );

    expect(labels).toEqual(SKILL_GROUPS.map((group) => group.category));
  });
});

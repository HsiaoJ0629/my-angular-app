import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { SummaryComponent } from '../summary/summary.component';
import { SkillsComponent } from '../skills/skills.component';
import { HistoryComponent } from "../history/history.component";

@Component({
  selector: 'app-about',
  imports: [
    MaterialModule,
    SummaryComponent,
    SkillsComponent,
    HistoryComponent
],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  selectedSkill: string = '';

  onSelectSkill(skill: string) {
    this.selectedSkill = skill;
  }
}

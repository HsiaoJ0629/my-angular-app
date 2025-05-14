import { Component } from '@angular/core';
import { MaterialModule } from '../modules/material.module';
import { SummaryComponent } from '../summary/summary.component';
import { SkillsComponent } from '../skills/skills.component';

@Component({
  selector: 'app-about',
  imports: [
    MaterialModule,
    SummaryComponent,
    SkillsComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}

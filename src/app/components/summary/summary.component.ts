import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-summary',
  imports: [ MaterialModule ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  summary: string = ' I\'m a Full Stack Developer with over five years of hands-on experience'
    + ' designing and building scalable, secure systems. I specialize in Java,'
    + ' Angular, Spring Boot, and MySQL, using these technologies to create'
    + ' solutions that improve business performance. I also enjoy mentoring'
    + ' junior developers and fostering a collaborative team environment to'
    + ' drive successful projects. I’m passionate about delivering high-quality'
    + ' results that align with business goals while continuously learning and'
    + ' adapting to new challenges.';
}

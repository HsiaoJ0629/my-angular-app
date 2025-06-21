import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  imports: [MaterialModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent implements OnChanges, OnInit {
  @Input() selectedSkill!: string;

  isHighlight: boolean = false;

  workHistorys: WorkHistory[] = [
    {
      company: 'Attvest Finance',
      role: 'Developer',
      start_year: 2022,
      end_year: 'Present',
      responsibilities: [
        'Designed and implemented scalable backend systems using Java and Spring Boot.',
        'Developed dynamic and user-friendly frontend interfaces with Angular and Bootstrap.',
        'Led technology research initiatives to integrate new tools, improving team efficiency.',
        'Mentored junior developers, enhancing their technical skills and contributing to project success.',
        'Streamlined business processes by delivering efficient IT solutions, increasing productivity.',
      ],
      skills: [
        'Java',
        'TypeScript',
        'JavaScript',
        'HTML',
        'CSS',
        'Angular',
        'Angular Material',
        'Bootstrap',
        'Spring Boot',
        'MySQL',
        'Docker',
        'GIT',
        'WildFly',
        'RESTful APIs',
        'Agile Development',
        'Microservices Architecture',
      ],
      isOpen: false,
    },
    {
      company: 'Sterling Systems Pty. Ltd.',
      role: 'Junior Programmer',
      start_year: 2020,
      end_year: 2022,
      responsibilities: [
        'Built and maintained web applications using Angular for the frontend and Node.js/Express.js for the backend.',
        'Managed databases with PostgreSQL, ensuring data integrity and performance optimization.',
        'Enhanced user interfaces with Angular Material and CSS, improving customer satisfaction.',
        'Provided prompt and effective customer support through online meetings and phone calls.',
        'Utilized GIT for version control, ensuring smooth collaboration across the development team.',
      ],
      skills: [
        'TypeScript',
        'JavaScript',
        'HTML',
        'CSS',
        'Angular',
        'Angular Material',
        'Bootstrap',
        'Node.js',
        'Express.js',
        'PostgreSQL',
        'GIT',
        'RESTful APIs',
      ],
      isOpen: false,
    },
  ];


  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSkill']) {
      for (let wh of this.workHistorys) {
        let findSkill = wh.skills.find((s) => s == this.selectedSkill);
        if (findSkill) {
          wh.isOpen = true;
        } else {
          wh.isOpen = false;
        }
      }

      this.isHighlight = this.workHistorys.every((wh) => wh.isOpen);
    }
  }

  ngOnInit(): void {}

  displayDate(wh: WorkHistory) {
    return wh.start_year + ' - ' + wh.end_year;
  }
}

class WorkHistory {
  company: string = '';
  role: string = '';
  start_year?: number;
  end_year?: number | string;
  responsibilities?: string[];
  skills: string[] = [];
  isOpen: boolean = false;
}

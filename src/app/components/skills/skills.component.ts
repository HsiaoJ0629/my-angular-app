import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-skills',
  imports: [MaterialModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  @Output() selectSkill = new EventEmitter<string>();
  selectedSkill: string = '';
  skills: Skill[] = [
    {
      category: 'Programming Languages',
      items: ['Java', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
    },
    {
      category: 'Frontend Frameworks',
      items: ['Angular', 'Angular Material', 'Bootstrap'],
    },
    {
      category: 'Backend Frameworks',
      items: ['Spring Boot', 'Node.js', 'Express.js'],
    },
    {
      category: 'Databases',
      items: ['MySQL', 'PostgreSQL'],
    },
    {
      category: 'Tools and Technologies',
      items: ['Docker', 'GIT', 'WildFly'],
    },
    {
      category: 'Development Practices',
      items: [
        'RESTful APIs',
        'Agile Development',
        'Microservices Architecture',
      ],
    },
  ];

  onSelectSkill(skill: string) {
    this.selectedSkill = skill;
    this.selectSkill.emit(skill);
  }
}

class Skill {
  category: string = '';
  items: string[] = [];
}

import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ MaterialModule, RouterModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  portfolioDescription: string = 'This portfolio website showcases my professional experience, technical expertise, and development capabilities. ' +
    'Built with Angular 19, Angular Material, and modern web technologies, it demonstrates my proficiency in creating ' +
    'responsive, performant, and user-friendly applications. Explore my work history, technical skills, and interactive ' +
    'demos that highlight my full-stack development capabilities.';
  
  portfolioTech: string[] = [
    'Angular 19 with Server-Side Rendering (SSR)',
    'Angular Material Design System',
    'TypeScript & Modern JavaScript',
    'Responsive Web Design',
    'RESTful API Integration',
    'Progressive Web App Features'
  ];
}

import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-home',
  imports: [ MaterialModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  welcomeMsg: string = 'Explore My Angular App! Discover my career journey, skills, and some demos — all in one place. '
    + 'This app is continuously updated, so check back often for the latest!';
}

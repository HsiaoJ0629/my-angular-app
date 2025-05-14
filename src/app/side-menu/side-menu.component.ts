import { Component } from '@angular/core';
import { MaterialModule } from '../modules/material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  imports: [ MaterialModule ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  constructor(private router: Router) {}

  goTo(url: string) {
    console.log(url)
    this.router.navigate([url]);
  }
}

import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../modules/material.module';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-side-menu',
  imports: [ MaterialModule ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  @ViewChild('sidenav', {static: true}) sidenav!: MatSidenav;
  constructor(private router: Router) {}

  goTo(url: string) {
    this.router.navigate([url]);
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../modules/material.module';
import { NavigationEnd, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-side-menu',
  imports: [ MaterialModule ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  
  selectedUrl: string = '/home';
  urls: Path[] = [
    { path: '/home', name: 'Home'},
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
    { path: '/demo', name: 'Demo' }
  ];
  
  constructor(
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
   
        for (let url of this.urls) {
          url.selected = url.path == event.url;
        }
         
      }
    });
  }

  goTo(url: string) {
    this.router.navigate([url]);
    this.sidenav.close();
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}


class Path {
  path: string = '';
  name: string = '';
  selected?: boolean = false;
}
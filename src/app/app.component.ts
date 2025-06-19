import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MaterialModule } from './modules/material.module';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SideMenuComponent,
    MaterialModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-angular-app';
  @ViewChild(SideMenuComponent) sideMenu!: SideMenuComponent;
  
  toggleSideMenu() {
    this.sideMenu.toggleSidenav(); // Call the toggleSidenav method of SideMenuComponent
  }
}

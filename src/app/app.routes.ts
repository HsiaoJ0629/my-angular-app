import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { DemoComponent } from './components/demo/demo.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent },
  { path: 'demo', component: DemoComponent },
  {path: '', redirectTo: '/home', pathMatch: 'full'}, // Default route
  {path: '**', redirectTo: '/home'} // Wildcard route
];

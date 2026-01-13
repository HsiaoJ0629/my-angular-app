import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-contact',
  imports: [ MaterialModule ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  email: string = 'arthur.hsiao0629@gmail.com';
  linkedInUrl: string = 'https://www.linkedin.com/in/arthur-hsiao-2874bb172/';
  
  openEmail() {
    window.location.href = `mailto:${this.email}?subject=Portfolio Contact`;
  }
  
  openLinkedIn() {
    window.open(this.linkedInUrl, '_blank');
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-header',
  imports: [ MaterialModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>(); // Output event emitter

  onMenuButtonClick() {
    this.menuToggle.emit(); // Emit the event when the button is clicked
  }
}

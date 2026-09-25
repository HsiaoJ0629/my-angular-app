import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * Thin wrapper over Toastr so feature code depends on an app-level concept
 * ("notify the user") rather than on a specific toast library.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly toastr = inject(ToastrService);

  success(message: string, title?: string): void {
    this.show('success', message, title);
  }

  error(message: string, title?: string): void {
    this.show('error', message, title);
  }

  private show(type: 'success' | 'error', message: string, title?: string): void {
    this.toastr.show(message, title, { positionClass: 'toast-top-center' }, `toast-${type}`);
  }
}

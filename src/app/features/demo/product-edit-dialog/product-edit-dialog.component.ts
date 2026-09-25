import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NotificationService } from '../../../core/notifications/notification.service';
import { ProductDraft } from '../../../core/products/product.model';
import { ProductsService } from '../../../core/products/products.service';

export interface ProductEditDialogData {
  readonly draft: ProductDraft;
  readonly title: string;
}

export interface ProductEditDialogResult {
  readonly saved: boolean;
}

@Component({
  selector: 'app-product-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-edit-dialog.component.html',
  styleUrl: './product-edit-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditDialogComponent {
  protected readonly data = inject<ProductEditDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef =
    inject<MatDialogRef<ProductEditDialogComponent, ProductEditDialogResult>>(MatDialogRef);
  private readonly products = inject(ProductsService);
  private readonly notifications = inject(NotificationService);
  private readonly formBuilder = inject(FormBuilder);

  /** True while a create/update request is in flight. */
  protected readonly isSaving = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    title: [this.data.draft.title, [Validators.required, Validators.maxLength(120)]],
    price: [this.data.draft.price, [Validators.required, Validators.min(0.01)]],
    stock: [this.data.draft.stock, [Validators.required, Validators.min(0)]],
  });

  protected get isNew(): boolean {
    return this.data.draft.id === 0;
  }

  protected save(): void {
    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    const draft: ProductDraft = { id: this.data.draft.id, ...this.form.getRawValue() };
    const request$ = this.isNew
      ? this.products.addProduct(draft)
      : this.products.updateProduct(draft);

    this.isSaving.set(true);
    this.form.disable();

    request$.subscribe({
      next: () => {
        this.notifications.success(this.isNew ? 'Product added' : 'Product updated');
        this.dialogRef.close({ saved: true });
      },
      error: (error: Error) => {
        this.isSaving.set(false);
        this.form.enable();
        this.notifications.error(error.message);
      },
    });
  }

  protected cancel(): void {
    this.dialogRef.close({ saved: false });
  }
}

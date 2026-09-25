import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import { NotificationService } from '../../../core/notifications/notification.service';
import { Product, ProductDraft } from '../../../core/products/product.model';
import { ProductsService } from '../../../core/products/products.service';
import { ProductEditDialogComponent, ProductEditDialogData } from './product-edit-dialog.component';

describe('ProductEditDialogComponent', () => {
  let fixture: ComponentFixture<ProductEditDialogComponent>;
  let element: HTMLElement;
  let addProduct: jasmine.Spy<(draft: ProductDraft) => Observable<Product>>;
  let updateProduct: jasmine.Spy<(draft: ProductDraft) => Observable<Product>>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ProductEditDialogComponent>>;
  let notifications: jasmine.SpyObj<NotificationService>;

  async function setup(data: ProductEditDialogData): Promise<void> {
    addProduct = jasmine.createSpy('addProduct').and.returnValue(of({} as Product));
    updateProduct = jasmine.createSpy('updateProduct').and.returnValue(of({} as Product));
    dialogRef = jasmine.createSpyObj<MatDialogRef<ProductEditDialogComponent>>('MatDialogRef', [
      'close',
    ]);
    notifications = jasmine.createSpyObj<NotificationService>('NotificationService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProductEditDialogComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: ProductsService, useValue: { addProduct, updateProduct } },
        { provide: NotificationService, useValue: notifications },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEditDialogComponent);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  function setField(name: string, value: string): void {
    const input = element.querySelector<HTMLInputElement>(`[formcontrolname="${name}"]`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function submit(): void {
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  const newDraft: ProductEditDialogData = {
    draft: { id: 0, title: '', price: 1, stock: 1 },
    title: 'New product',
  };
  const existingDraft: ProductEditDialogData = {
    draft: { id: 42, title: 'Laptop', price: 999, stock: 5 },
    title: 'Laptop',
  };

  it('prefills the form from the supplied draft', async () => {
    await setup(existingDraft);

    expect(element.querySelector<HTMLInputElement>('[formcontrolname="title"]')!.value).toBe(
      'Laptop',
    );
    expect(element.querySelector<HTMLInputElement>('[formcontrolname="price"]')!.value).toBe('999');
  });

  it('refuses to submit an empty title', async () => {
    await setup(newDraft);
    setField('title', '');

    submit();

    expect(addProduct).not.toHaveBeenCalled();
  });

  it('refuses to submit a non-positive price', async () => {
    await setup(newDraft);
    setField('title', 'Widget');
    setField('price', '0');

    submit();

    expect(addProduct).not.toHaveBeenCalled();
  });

  it('shows a validation message once an invalid field has been touched', async () => {
    await setup(newDraft);
    setField('title', '');

    submit();

    expect(element.textContent).toContain('Title is required');
  });

  it('creates a product when the draft has no id', async () => {
    await setup(newDraft);
    setField('title', 'Widget');
    setField('price', '12.5');
    setField('stock', '7');

    submit();

    expect(addProduct).toHaveBeenCalledWith({ id: 0, title: 'Widget', price: 12.5, stock: 7 });
    expect(updateProduct).not.toHaveBeenCalled();
  });

  it('updates an existing product and keeps its id', async () => {
    await setup(existingDraft);
    setField('price', '1099');

    submit();

    expect(updateProduct).toHaveBeenCalledWith(jasmine.objectContaining({ id: 42, price: 1099 }));
    expect(addProduct).not.toHaveBeenCalled();
  });

  it('closes with a saved result so the caller knows to refresh', async () => {
    await setup(existingDraft);

    submit();

    expect(dialogRef.close).toHaveBeenCalledWith({ saved: true });
    expect(notifications.success).toHaveBeenCalled();
  });

  it('stays open and reports the failure when saving fails', async () => {
    await setup(existingDraft);
    updateProduct.and.returnValue(throwError(() => new Error('Unable to update the product.')));

    submit();

    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(notifications.error).toHaveBeenCalledWith('Unable to update the product.');
  });

  it('re-enables the form after a failure so the user can try again', async () => {
    await setup(existingDraft);
    updateProduct.and.returnValue(throwError(() => new Error('nope')));

    submit();

    const save = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.type === 'submit',
    )!;
    expect(save.disabled).toBeFalse();
  });

  it('closes without saving when cancelled', async () => {
    await setup(existingDraft);

    const cancel = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => (button.textContent ?? '').includes('Cancel'),
    )!;
    cancel.click();

    expect(dialogRef.close).toHaveBeenCalledWith({ saved: false });
    expect(updateProduct).not.toHaveBeenCalled();
  });
});

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { Product, ProductPage, ProductQuery } from '../../core/products/product.model';
import { ProductsService } from '../../core/products/products.service';
import { DemoComponent } from './demo.component';

function makeProduct(id: number, title: string): Product {
  return {
    id,
    title,
    description: '',
    category: '',
    price: id * 10,
    discountPercentage: 0,
    rating: 0,
    stock: id,
    tags: [],
    brand: '',
    sku: '',
    thumbnail: '',
    images: [],
  };
}

function pageOf(products: Product[], total = products.length): ProductPage {
  return { products, total, skip: 0, limit: 10 };
}

describe('DemoComponent', () => {
  let fixture: ComponentFixture<DemoComponent>;
  let element: HTMLElement;
  let loader: HarnessLoader;
  let getProducts: jasmine.Spy<(query: ProductQuery) => Observable<ProductPage>>;
  let dialogAfterClosed: Observable<unknown>;

  /** The debounce window plus a margin, so timers have certainly fired. */
  const DEBOUNCE = 350;

  beforeEach(async () => {
    getProducts = jasmine
      .createSpy('getProducts')
      .and.returnValue(of(pageOf([makeProduct(1, 'Laptop'), makeProduct(2, 'Phone')], 194)));
    dialogAfterClosed = of(undefined);

    await TestBed.configureTestingModule({
      imports: [DemoComponent],
      providers: [provideNoopAnimations(), { provide: ProductsService, useValue: { getProducts } }],
    }).compileComponents();

    TestBed.overrideProvider(MatDialog, {
      useValue: { open: () => ({ afterClosed: () => dialogAfterClosed }) },
    });

    fixture = TestBed.createComponent(DemoComponent);
    element = fixture.nativeElement as HTMLElement;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  /** Renders the component and lets the debounced request settle. */
  function settle(): void {
    fixture.detectChanges();
    tick(DEBOUNCE);
    fixture.detectChanges();
  }

  function lastQuery(): ProductQuery {
    return getProducts.calls.mostRecent().args[0];
  }

  function typeSearch(value: string): void {
    const input = element.querySelector<HTMLInputElement>('input[type="search"]')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function rowTitles(): string[] {
    return Array.from(element.querySelectorAll('tbody tr td:first-child')).map((cell) =>
      (cell.textContent ?? '').trim(),
    );
  }

  it('loads the first page and renders the returned products', fakeAsync(() => {
    settle();

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(lastQuery()).toEqual(jasmine.objectContaining({ search: '', limit: 10, skip: 0 }));
    expect(rowTitles()).toEqual(['Laptop', 'Phone']);
    flush();
  }));

  it('issues one request for a burst of keystrokes', fakeAsync(() => {
    settle();
    getProducts.calls.reset();

    typeSearch('l');
    tick(100);
    typeSearch('la');
    tick(100);
    typeSearch('lap');
    settle();

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(lastQuery().search).toBe('lap');
    flush();
  }));

  it('returns to the first page when the search term changes', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    await (await loader.getHarness(MatPaginatorHarness)).goToNextPage();
    fixture.detectChanges();
    expect(lastQuery().skip).toBe(10);

    typeSearch('phone');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE));
    fixture.detectChanges();

    expect(lastQuery().skip).toBe(0);
  });

  it('asks the server to sort and restarts from the first page', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await (await loader.getHarness(MatPaginatorHarness)).goToNextPage();
    fixture.detectChanges();
    expect(lastQuery().skip).toBe(10);

    const priceHeader = Array.from(element.querySelectorAll<HTMLElement>('th')).find((th) =>
      (th.textContent ?? '').includes('Price'),
    )!;
    priceHeader.click();
    fixture.detectChanges();

    expect(lastQuery()).toEqual(
      jasmine.objectContaining({ sortBy: 'price', sortOrder: 'asc', skip: 0 }),
    );
  });

  it('does not send sort parameters while the table is unsorted', fakeAsync(() => {
    settle();

    expect(lastQuery().sortBy).toBeUndefined();
    expect(lastQuery().sortOrder).toBeUndefined();
    flush();
  }));

  it('shows a retryable message instead of spinning forever when loading fails', fakeAsync(() => {
    getProducts.and.returnValue(throwError(() => new Error('Unable to load products.')));
    settle();

    const alert = element.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Unable to load products.');
    expect(element.querySelector('.loading-shade')).toBeNull();
    flush();
  }));

  it('refetches when the error message is retried', fakeAsync(() => {
    getProducts.and.returnValue(throwError(() => new Error('Unable to load products.')));
    settle();
    getProducts.calls.reset();
    getProducts.and.returnValue(of(pageOf([makeProduct(3, 'Tablet')])));

    const retry = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find((button) =>
      (button.textContent ?? '').includes('Retry'),
    )!;
    retry.click();
    settle();

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(rowTitles()).toEqual(['Tablet']);
    expect(element.querySelector('[role="alert"]')).toBeNull();
    flush();
  }));

  it('tells the user when a search matches nothing', fakeAsync(() => {
    getProducts.and.returnValue(of(pageOf([], 0)));
    settle();

    expect(element.querySelector('.table-message.empty')?.textContent).toContain(
      'No products matched',
    );
    flush();
  }));

  it('reloads the table after the edit dialog reports a save', fakeAsync(() => {
    settle();
    getProducts.calls.reset();
    dialogAfterClosed = of({ saved: true });

    element.querySelector<HTMLButtonElement>('.add-button')!.click();
    settle();

    expect(getProducts).toHaveBeenCalledTimes(1);
    flush();
  }));

  it('does not reload when the dialog is dismissed without saving', fakeAsync(() => {
    settle();
    getProducts.calls.reset();
    // `afterClosed` emits undefined for an Escape key press or backdrop click.
    dialogAfterClosed = of(undefined);

    element.querySelector<HTMLButtonElement>('.add-button')!.click();
    settle();

    expect(getProducts).not.toHaveBeenCalled();
    flush();
  }));

  it('exposes the server-reported total so paging covers every result', fakeAsync(() => {
    getProducts.and.returnValue(of(pageOf([makeProduct(1, 'Laptop')], 194)));
    settle();

    expect(element.querySelector('.mat-mdc-paginator-range-label')?.textContent).toContain('194');
    flush();
  }));
});

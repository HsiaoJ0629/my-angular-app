import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { of, switchMap, tap } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  Product,
  ProductPage,
  ProductQuery,
  ProductSortField,
  emptyProductDraft,
  toDraft,
} from '../../core/products/product.model';
import { ProductsService } from '../../core/products/products.service';
import {
  ProductEditDialogComponent,
  ProductEditDialogData,
  ProductEditDialogResult,
} from './product-edit-dialog/product-edit-dialog.component';

const SEARCH_DEBOUNCE_MS = 300;
const EMPTY_PAGE: ProductPage = { products: [], total: 0, skip: 0, limit: 0 };

/** The full set of inputs that determine which page of data to fetch. */
interface FetchRequest extends ProductQuery {
  /** Bumped by {@link DemoComponent.reload} to force a refetch of the same query. */
  readonly nonce: number;
}

@Component({
  selector: 'app-demo',
  imports: [
    CurrencyPipe,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent {
  private readonly productsService = inject(ProductsService);
  private readonly dialog = inject(MatDialog);

  protected readonly displayedColumns = ['title', 'price', 'stock'] as const;
  protected readonly pageSizeOptions = [5, 10, 30, 100];

  protected readonly searchInput = signal('');
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly sort = signal<Sort | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly reloadNonce = signal(0);

  /**
   * Typing fires on every keystroke, so the search term is debounced before it
   * becomes part of the fetch request.
   */
  private readonly debouncedSearch = toSignal(
    toObservable(this.searchInput).pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged()),
    { initialValue: '' },
  );

  private readonly request = computed<FetchRequest>(() => {
    const size = this.pageSize();
    const sort = this.sort();
    // `MatSort` uses an empty direction for the "unsorted" step of its cycle.
    const direction = sort?.direction || undefined;

    return {
      search: this.debouncedSearch(),
      limit: size,
      skip: this.pageIndex() * size,
      sortBy: direction ? (sort?.active as ProductSortField) : undefined,
      sortOrder: direction,
      nonce: this.reloadNonce(),
    };
  });

  /**
   * `switchMap` cancels any request still in flight when the query changes, so
   * fast typing or paging can never let a stale response overwrite a newer one.
   */
  private readonly page = toSignal(
    toObservable(this.request).pipe(
      distinctUntilChanged((a, b) => this.isSameRequest(a, b)),
      tap(() => {
        this.isLoading.set(true);
        this.errorMessage.set(null);
      }),
      switchMap((request) =>
        this.productsService.getProducts(request).pipe(
          catchError((error: Error) => {
            this.errorMessage.set(error.message);
            return of(EMPTY_PAGE);
          }),
        ),
      ),
      tap(() => this.isLoading.set(false)),
    ),
    { initialValue: EMPTY_PAGE },
  );

  protected readonly products = computed(() => this.page().products);
  protected readonly totalCount = computed(() => this.page().total);
  protected readonly isEmpty = computed(
    () => !this.isLoading() && !this.errorMessage() && this.products().length === 0,
  );

  protected onSearchInput(value: string): void {
    this.searchInput.set(value);
    // A new search invalidates the current offset.
    this.pageIndex.set(0);
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  /** Sorting is applied server-side, so it must restart from the first page. */
  protected onSortChange(sort: Sort): void {
    this.sort.set(sort);
    this.pageIndex.set(0);
  }

  protected reload(): void {
    this.reloadNonce.update((value) => value + 1);
  }

  protected addProduct(): void {
    this.openEditor({ draft: emptyProductDraft(), title: 'New product' });
  }

  protected editProduct(product: Product): void {
    this.openEditor({ draft: toDraft(product), title: product.title });
  }

  private openEditor(data: ProductEditDialogData): void {
    this.dialog
      .open<ProductEditDialogComponent, ProductEditDialogData, ProductEditDialogResult>(
        ProductEditDialogComponent,
        { data, minWidth: '40%', maxWidth: '100%', autoFocus: 'first-tabbable' },
      )
      .afterClosed()
      // `afterClosed` emits `undefined` when the dialog is dismissed with Escape
      // or a backdrop click, so the result is always treated as optional.
      .subscribe((result) => {
        if (result?.saved) {
          this.reload();
        }
      });
  }

  private isSameRequest(a: FetchRequest, b: FetchRequest): boolean {
    return (
      a.search === b.search &&
      a.limit === b.limit &&
      a.skip === b.skip &&
      a.sortBy === b.sortBy &&
      a.sortOrder === b.sortOrder &&
      a.nonce === b.nonce
    );
  }
}

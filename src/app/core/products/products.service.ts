import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Product, ProductDraft, ProductPage, ProductQuery } from './product.model';

const API_BASE_URL = 'https://dummyjson.com';

/**
 * Data access for the demo product catalogue (DummyJSON public API).
 *
 * Query strings are built with `HttpParams` so user input is encoded correctly,
 * and transport errors are normalised into `Error`s with messages the UI can show.
 */
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches one page of products. Searching, paging and sorting are all applied
   * server-side so that sorting covers the whole result set, not just the rows
   * currently on screen.
   */
  getProducts(query: ProductQuery): Observable<ProductPage> {
    const search = query.search.trim();
    const url = search ? `${API_BASE_URL}/products/search` : `${API_BASE_URL}/products`;

    let params = new HttpParams().set('limit', query.limit).set('skip', query.skip);

    if (search) {
      params = params.set('q', search);
    }
    if (query.sortBy) {
      params = params.set('sortBy', query.sortBy).set('order', query.sortOrder ?? 'asc');
    }

    return this.http
      .get<ProductPage>(url, { params })
      .pipe(catchError((error) => this.toUserFacingError(error, 'Unable to load products.')));
  }

  addProduct(draft: ProductDraft): Observable<Product> {
    return this.http
      .post<Product>(`${API_BASE_URL}/products/add`, this.writableFields(draft))
      .pipe(catchError((error) => this.toUserFacingError(error, 'Unable to add the product.')));
  }

  updateProduct(draft: ProductDraft): Observable<Product> {
    return this.http
      .put<Product>(`${API_BASE_URL}/products/${draft.id}`, this.writableFields(draft))
      .pipe(catchError((error) => this.toUserFacingError(error, 'Unable to update the product.')));
  }

  /** Sends only the fields the API accepts, never the whole client-side object. */
  private writableFields(draft: ProductDraft): Omit<ProductDraft, 'id'> {
    return { title: draft.title, price: draft.price, stock: draft.stock };
  }

  private toUserFacingError(error: HttpErrorResponse, fallback: string): Observable<never> {
    const detail =
      error.status === 0
        ? 'The server could not be reached — check your connection.'
        : `The server responded with ${error.status}.`;
    return throwError(() => new Error(`${fallback} ${detail}`));
  }
}

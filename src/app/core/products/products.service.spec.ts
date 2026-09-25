import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProductPage } from './product.model';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const emptyPage: ProductPage = { products: [], total: 0, skip: 0, limit: 10 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getProducts', () => {
    it('uses the list endpoint when no search term is supplied', () => {
      service.getProducts({ search: '', limit: 10, skip: 0 }).subscribe();

      const request = httpMock.expectOne((req) => req.url === 'https://dummyjson.com/products');
      expect(request.request.params.get('limit')).toBe('10');
      expect(request.request.params.get('skip')).toBe('0');
      expect(request.request.params.has('q')).toBeFalse();
      request.flush(emptyPage);
    });

    it('uses the search endpoint and sends the trimmed term when searching', () => {
      service.getProducts({ search: '  phone  ', limit: 5, skip: 10 }).subscribe();

      const request = httpMock.expectOne(
        (req) => req.url === 'https://dummyjson.com/products/search',
      );
      expect(request.request.params.get('q')).toBe('phone');
      expect(request.request.params.get('skip')).toBe('10');
      request.flush(emptyPage);
    });

    it('encodes search terms so query-string characters cannot break the URL', () => {
      service.getProducts({ search: 'a&b=c #1', limit: 10, skip: 0 }).subscribe();

      const request = httpMock.expectOne((req) => req.url.endsWith('/products/search'));
      // The raw value survives round-tripping, which only holds if it was encoded.
      expect(request.request.params.get('q')).toBe('a&b=c #1');
      // '&' and '#' would otherwise terminate the value; '=' is legal inside one.
      expect(request.request.urlWithParams).toContain('%26');
      expect(request.request.urlWithParams).toContain('%23');
      expect(request.request.urlWithParams).not.toMatch(/q=a&b/);
      request.flush(emptyPage);
    });

    it('forwards sorting to the server so it applies across the whole result set', () => {
      service
        .getProducts({ search: '', limit: 10, skip: 0, sortBy: 'price', sortOrder: 'desc' })
        .subscribe();

      const request = httpMock.expectOne((req) => req.url.endsWith('/products'));
      expect(request.request.params.get('sortBy')).toBe('price');
      expect(request.request.params.get('order')).toBe('desc');
      request.flush(emptyPage);
    });

    it('defaults the sort order to ascending when only a field is given', () => {
      service.getProducts({ search: '', limit: 10, skip: 0, sortBy: 'title' }).subscribe();

      const request = httpMock.expectOne((req) => req.url.endsWith('/products'));
      expect(request.request.params.get('order')).toBe('asc');
      request.flush(emptyPage);
    });

    it('omits sort parameters entirely when nothing is sorted', () => {
      service.getProducts({ search: '', limit: 10, skip: 0 }).subscribe();

      const request = httpMock.expectOne((req) => req.url.endsWith('/products'));
      expect(request.request.params.has('sortBy')).toBeFalse();
      expect(request.request.params.has('order')).toBeFalse();
      request.flush(emptyPage);
    });

    it('reports an offline failure in terms the UI can show the user', (done) => {
      service.getProducts({ search: '', limit: 10, skip: 0 }).subscribe({
        error: (error: Error) => {
          expect(error.message).toContain('Unable to load products.');
          expect(error.message).toContain('could not be reached');
          done();
        },
      });

      httpMock
        .expectOne((req) => req.url.endsWith('/products'))
        .error(new ProgressEvent('error'), { status: 0 });
    });

    it('includes the status code when the server rejects the request', (done) => {
      service.getProducts({ search: '', limit: 10, skip: 0 }).subscribe({
        error: (error: Error) => {
          expect(error.message).toContain('The server responded with 500.');
          done();
        },
      });

      httpMock
        .expectOne((req) => req.url.endsWith('/products'))
        .flush('boom', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('writes', () => {
    it('posts only the writable fields when adding a product', () => {
      service.addProduct({ id: 0, title: 'Widget', price: 9.5, stock: 3 }).subscribe();

      const request = httpMock.expectOne('https://dummyjson.com/products/add');
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({ title: 'Widget', price: 9.5, stock: 3 });
      request.flush({});
    });

    it('puts to the product id and never sends the id in the body', () => {
      service.updateProduct({ id: 42, title: 'Widget', price: 9.5, stock: 3 }).subscribe();

      const request = httpMock.expectOne('https://dummyjson.com/products/42');
      expect(request.request.method).toBe('PUT');
      expect(request.request.body).toEqual({ title: 'Widget', price: 9.5, stock: 3 });
      request.flush({});
    });

    it('surfaces a write failure with an action-specific message', (done) => {
      service.updateProduct({ id: 42, title: 'Widget', price: 1, stock: 1 }).subscribe({
        error: (error: Error) => {
          expect(error.message).toContain('Unable to update the product.');
          done();
        },
      });

      httpMock
        .expectOne('https://dummyjson.com/products/42')
        .flush('nope', { status: 404, statusText: 'Not Found' });
    });
  });

  it('does not leak the raw HttpErrorResponse to callers', (done) => {
    service.getProducts({ search: '', limit: 1, skip: 0 }).subscribe({
      error: (error: unknown) => {
        expect(error instanceof HttpErrorResponse).toBeFalse();
        expect(error instanceof Error).toBeTrue();
        done();
      },
    });

    httpMock
      .expectOne((req) => req.url.endsWith('/products'))
      .flush('', { status: 503, statusText: 'Unavailable' });
  });
});

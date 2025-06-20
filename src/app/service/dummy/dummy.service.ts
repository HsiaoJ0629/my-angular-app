import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductList } from './model/productList';
import { Product } from './model/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DummyService {

  baseUrl: string = 'https://dummyjson.com/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };


  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  getProducts(limit: number, skip?: number): Observable<ProductList> {
    let url = this.baseUrl + 'products?limit=' + limit + (skip ? ('&skip='+skip) : '');
    return this.http.get<ProductList>(url);
  }

  searchProducts(searchTerm: string, limit: number, skip?: number): Observable<ProductList> {
    let url = this.baseUrl + 'products/search?q=' + searchTerm + '&limit=' + limit + (skip ? ('&skip='+skip) : '');
    return this.http.get<ProductList>(url);
  }

  getProduct(id: number): Observable<Product>{
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  addProduct(product: Product): Observable<Product>{
    return this.http.post<Product>(this.baseUrl + 'products/add', product, this.httpOptions);
  }

  updateProduct(product: Product): Observable<Product>{
    let updateBody = {
      title: product.title, 
      price: product.price, 
      stock: product.stock
    };
    return this.http.put<Product>(this.baseUrl + 'products/' + product.id, updateBody, this.httpOptions);
  }

  showAlert(type: 'success' | 'error', message: string, title?: string, duration?: number) {
    this.toastr.show(
      message,
      title,
      {
        positionClass: 'toast-top-center',
      },
      'toast-' + type
    );
  }
}

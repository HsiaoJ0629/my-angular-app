import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductList } from './model/productList';
import { Product } from './model/product';

@Injectable({
  providedIn: 'root'
})
export class DummyService {

  baseUrl: string = 'https://dummyjson.com/';

  constructor(
    private http: HttpClient
  ) { }

  getProducts(limit: number, skip?: number): Observable<ProductList> {
    let url = this.baseUrl + 'products?limit=' + limit + (skip ? ('&skip='+skip) : '');
    return this.http.get<ProductList>(url);
  }

  getProduct(id: number): Observable<Product>{
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  addProduct(product: Product): Observable<Product>{
    return this.http.post<Product>(this.baseUrl + 'products/add', product);
  }

  updateProduct(product: Product): Observable<Product>{
    return this.http.post<Product>(this.baseUrl + 'products/' + product.id, product);
  }
}

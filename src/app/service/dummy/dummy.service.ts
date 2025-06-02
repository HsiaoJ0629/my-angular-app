import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DummyService {

  constructor(
    private http: HttpClient
  ) { }

  getProducts(limit: number, skip?: number): Observable<any> {
    let url = 'https://dummyjson.com/products?limit=' + limit + (skip ? ('&skip='+skip) : '');
    return this.http.get(url);
  }
}

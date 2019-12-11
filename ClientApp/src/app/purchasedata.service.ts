import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
//import { Observable } from 'rxjs/Observable';

//import 'rxjs/add/operator/map';
import {map} from 'rxjs/operators';

//import 'rxjs/add/operator/toPromise';
//replaced by Observable().toPromise

import { Product } from './Model/Product';
import { IPurchase, Purchase } from './Model/Purchase';
import { Category } from './Model/Category';
import { CategoryXref } from './Model/CategoryXref';

@Injectable({
  providedIn: 'root'
})
export class PurchasedataService {

  constructor(private _http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }


  getProducts()  {
    //force result to string
      console.log("url", `${this.baseUrl}api/product/`);
      return this._http.get<Product[]>("http://localhost:9000/api/product", {observe: 'response'});
  }

  getPurchases()   {
    //force result to string
      console.log("url", `${this.baseUrl}api/purchase/`);
      return this._http.get<Purchase[]>("http://localhost:9000/api/purchase", {observe: 'response'}) ;
  }

  getCategories()   {
    //force result to string
      console.log("url", `${this.baseUrl}api/category/`);
      return this._http.get<Category[]>("http://localhost:9000/api/category", {observe: 'response'}) ;
  }

  getCategoryXref()   {
    //force result to string
      console.log("url", `${this.baseUrl}api/categoryxref/`);
      return this._http.get<CategoryXref[]>("http://localhost:9000/api/CategoryXref") ;
  }

}

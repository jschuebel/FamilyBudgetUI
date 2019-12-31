import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
//import { Observable } from 'rxjs/Observable';

//import 'rxjs/add/operator/map';
import {map, filter} from 'rxjs/operators';

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
  //dataUrl = "http://localhost:5002/api/";
  dataUrl = "https://www.schuebelsoftware.com/fbplannerapi/api/";
  constructor(private _http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  /*******************************************   Products ******************************************* */
  getProducts(filterParams)  {
    console.log("getProducts filterParams=", filterParams);
    console.log("baseurl", `${this.baseUrl}api/product/`);
    console.log("url", `${this.dataUrl}product`);
    
      //return this._http.get<Product[]>("http://localhost:5002/api/product?page=1&pageSize=8", {observe: 'response'});
      if (filterParams!=null)
        return this._http.get<Product[]>(`${this.dataUrl}product?${filterParams}`, {observe: 'response'});
      else
        return this._http.get<Product[]>(`${this.dataUrl}product`, {observe: 'response'});
      //return this._http.get<Product[]>("http://localhost:9000/api/product", {observe: 'response'});
  }

  saveProduct(p : Product ) {
    var hldp = JSON.parse(JSON.stringify(p));
    console.log("baseurl", `${this.baseUrl}api/product/`);
    console.log("url", `${this.dataUrl}product`);
    if (p.ProductID===0)
      return this._http.post<Product>(`${this.dataUrl}product`,p);
    else
      return this._http.put<Product>(`${this.dataUrl}product`,p);
    //return this._http.put<Product>(`${this.dataUrl}product/${p.ProductID}`,p);
    //    return this._http.put<Person>(`${this.baseUrl}api/person/${person.id}`,person);
      //params: new HttpParams().set('id',`${person.id}`)
      //.map(result=>this.result=result.json().data);
  }

  deleteProduct(p : Product ) {
    var hldp = JSON.parse(JSON.stringify(p));
    console.log("baseurl", `${this.baseUrl}api/product/`);
    console.log("url", `${this.dataUrl}product`);
    return this._http.delete(`${this.dataUrl}product/${p.ProductID}`);
  }

  /*******************************************   Purchases ******************************************* */
  getPurchases(filterParams)   {
    //force result to string
      console.log("url", `${this.baseUrl}api/purchase/`);
      console.log("getProducts filterParams=", filterParams);
      if (filterParams!=null)
        return this._http.get<Product[]>(`${this.dataUrl}purchase?${filterParams}`, {observe: 'response'});
      else
        return this._http.get<Product[]>(`${this.dataUrl}purchase`, {observe: 'response'});
      //return this._http.get<Purchase[]>("http://localhost:9000/api/purchase", {observe: 'response'}) ;
  }

  savePurchase(p : Purchase ) {
    var hldp = JSON.parse(JSON.stringify(p));
    console.log("baseurl", `${this.baseUrl}api/purchase/`);
    console.log("url", `${this.dataUrl}purchase`);
    if (p.PurchaseID===0)
      return this._http.post<Purchase>(`${this.dataUrl}purchase`,p);
    else
      return this._http.put<Purchase>(`${this.dataUrl}purchase`,p);
    //return this._http.put<Product>(`${this.dataUrl}product/${p.ProductID}`,p);
    //    return this._http.put<Person>(`${this.baseUrl}api/person/${person.id}`,person);
      //params: new HttpParams().set('id',`${person.id}`)
      //.map(result=>this.result=result.json().data);
  }

  deletePurchase(p : Purchase ) {
    var hldp = JSON.parse(JSON.stringify(p));
    console.log("baseurl", `${this.baseUrl}api/purchase/`);
    console.log("url", `${this.dataUrl}purchase`);
    return this._http.delete(`${this.dataUrl}purchase/${p.PurchaseID}`);
  }

  /*******************************************   Categories ******************************************* */
  getCategories(filterParams)   {
    //force result to string
      console.log("url", `${this.baseUrl}api/category/`);
      if (filterParams!=null)
        return this._http.get<Category[]>(`${this.dataUrl}category?${filterParams}`, {observe: 'response'});
      else
        return this._http.get<Category[]>(`${this.dataUrl}category`, {observe: 'response'}) ;
      //return this._http.get<Category[]>("http://localhost:9000/api/category", {observe: 'response'}) ;
    }

    saveCategory(p : Category ) {
      var hldp = JSON.parse(JSON.stringify(p));
      console.log("baseurl", `${this.baseUrl}api/category/`);
      console.log("url", `${this.dataUrl}category`);
      if (p.CategoryID===0)
        return this._http.post<Category>(`${this.dataUrl}category`,p);
      else
        return this._http.put<Category>(`${this.dataUrl}category`,p);
      //return this._http.put<Product>(`${this.dataUrl}product/${p.ProductID}`,p);
      //    return this._http.put<Person>(`${this.baseUrl}api/person/${person.id}`,person);
        //params: new HttpParams().set('id',`${person.id}`)
        //.map(result=>this.result=result.json().data);
    }
  
    deleteCategory(p : Category ) {
      var hldp = JSON.parse(JSON.stringify(p));
      console.log("baseurl", `${this.baseUrl}api/category/`);
      console.log("url", `${this.dataUrl}category`);
      return this._http.delete(`${this.dataUrl}category/${p.CategoryID}`);
    }
  


  getCategoryXref(filterParams)   {
    //force result to string
      console.log("url", `${this.baseUrl}api/categoryxref/`);
      if (filterParams!=null)
        return this._http.get<CategoryXref[]>(`${this.dataUrl}categoryxref?${filterParams}`, {observe: 'response'});
      else
        return this._http.get<CategoryXref[]>(`${this.dataUrl}categoryxref`, {observe: 'response'}) ;
      //return this._http.get<CategoryXref[]>("http://localhost:9000/api/CategoryXref") ;
  }

  saveCategoryXref(ProductID: number, p : Category[] ) {
    var hldp = JSON.parse(JSON.stringify(p));
    console.log("baseurl", `${this.baseUrl}api/categoryxref/`);
    console.log("url", `${this.dataUrl}categoryxref`);
    return this._http.put(`${this.dataUrl}categoryxref/${ProductID}`,p);
    //return this._http.put<Product>(`${this.dataUrl}product/${ProductID}`,p);
    //    return this._http.put<Person>(`${this.baseUrl}api/person/${person.id}`,person);
      //params: new HttpParams().set('id',`${person.id}`)
      //.map(result=>this.result=result.json().data);
  }



  /*******************************************   Report ******************************************* */
  getReport(filterParams)   {
    //force result to string
      console.log("url", `${this.baseUrl}api/report/`, filterParams);
      return this._http.get(`${this.dataUrl}report?${filterParams}`);
    }

}

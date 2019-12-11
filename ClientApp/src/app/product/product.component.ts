import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


import  * as _ from 'lodash';

import { PurchasedataService } from '../Purchasedata.service';
import { Product } from '../Model/Product';
import { Category } from '../Model/Category';
import { CategoryXref } from '../Model/CategoryXref';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  Products : Product[] = [];
  pagedItems: any[];
  selectedProduct: Product = new Product();
  Categorys: Category[];
  CategoryXrefs: CategoryXref[];
  currentPage = 0;
  pageSize = 10;
  numberOfPages=0;
  disableAdd = false;
  disableClear = false;
  disableUpdate = true;
  disableDelete = true;
  selectedProductID:string;
  
  constructor(private _dataService:PurchasedataService) { }

  ngOnInit() {
    this.selectedProduct.Cost=null;
    let self = this;
    let pageSize = this.pageSize;
    forkJoin(
      this._dataService.getCategories(),
      this._dataService.getCategoryXref(),
      this._dataService.getProducts()
      // getMultiValueObservable(), forkJoin on works for observables that complete
    ).subscribe(([cat, catX, prod]) => {
      this.Categorys=cat.body;
      this.CategoryXrefs=catX;
  
      console.log('this.Categorys',this.Categorys);
      console.log('this.CategoryXrefs',this.CategoryXrefs);

        let total : number =  + prod.headers.get('X-Total-Count');
        console.log('this.Products total',total);

        this.Products = <Product[]> _.reduce(prod.body, function(memo, prod, idx) {
          const mprod = new Product(prod);
          memo.push(mprod);
          return memo;
        }, []);
        
        console.log("Products",this.Products);
        if (total>0 && total < this.pageSize)
          this.numberOfPages = 1;
        else
          this.numberOfPages = Math.round(total / this.pageSize);
        let modr = (total % this.pageSize) ;
        if (modr>0 && modr<6) this.numberOfPages++;
        console.log("numberOfPages=",this.numberOfPages, "total returned",total);
        this.setPage();
      },
      err => {
        console.log("Error from multi subscribe", err)
      });

    /*
    this._dataService.getCategoryXref()
    .subscribe(resCatX => {
        this.CategoryXrefs = resCatX;
        console.log("CategoryXrefs",this.CategoryXrefs);


        this._dataService.getProducts()
        .subscribe(resProd => {
          //this.Products = resProd.body;
          let total : number =  + resProd.headers.get('X-Total-Count');

          this.Products = <Product[]> _.reduce(resProd.body, function(memo, prod, idx) {
            const mprod = new Product(prod);
            memo.push(mprod);
            return memo;
          }, []);
          
          console.log("Products",this.Products);
          if (total>0 && total < this.pageSize)
          this.numberOfPages = 1;
        else
          this.numberOfPages = Math.round(total / this.pageSize);
          let modr = (total % this.pageSize) ;
          if (modr>0 && modr<6) this.numberOfPages++;
          console.log("numberOfPages=",this.numberOfPages, "total returned",total);
          this.setPage();
        },
        err => {
          console.log("Error from getProducts", err)
        });
    },
    err => {
      console.log("Error from getCategoryXref", err)
    });
*/    
  }

  public highlightRow(purch) {
    this.selectedProductID = purch.ProductID;
  }
  
  setPage() {
    if (this.currentPage < 0) {
      this.currentPage=0;
      return;
    }
    if (this.currentPage > this.numberOfPages-1) {
      this.currentPage=this.numberOfPages-1;
      return;
    }

    console.log("sePage len=",this.Products.length, "  currpage=", this.currentPage, "   pagesize=", this.pageSize, "    numberOfPages=", this.numberOfPages);
    this.pagedItems = this.Products.slice(this.currentPage*this.pageSize, this.currentPage*this.pageSize + this.pageSize);
    console.log("this.pagedItems=",this.pagedItems);
  }

  goToLink(prod) {
    let self= this;
    console.log("goToLink prod", prod);

    this.selectedProduct = prod;


     _.reduce(this.Categorys, function(memo, cat1, idx) {
      //console.log('cat1',cat1);
        let catX1 =  self.CategoryXrefs.find(function(catX2) {
          return catX2.CategoryID==cat1.CategoryID && catX2.ProductID==prod.ProductID;
        });
        //console.log('catX2',catX1,'cat', cat1);
        if (catX1==null) 
          cat1.wasChecked=false;
        else
          cat1.wasChecked=true;
    }, []);

    this.disableAdd = true;
    this.disableUpdate = false;
    this.disableDelete = false;
  }


  UpdateProduct() {
    console.log("Update selectedProduct", this.selectedProduct);

    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;
  
  }

  ClearPurchase() {
    this.selectedProduct=new Product();
    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;
  
    _.reduce(this.Categorys, function(memo, cat1, idx) {
          cat1.wasChecked=false;
    }, []);


  }

}

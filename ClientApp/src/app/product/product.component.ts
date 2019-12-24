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
  //pagedItems: any[];
  selectedProduct: Product = new Product();
  Categorys: Category[];
  CategoryXrefs: CategoryXref[];
  message: string;
  
  currentPage = 0;
  pageSize = 10;
  numberOfPages=0;
  sortColumn: string = 'Title';
  sortDirection : string = "asc";
  //filterField:string = 'Date';
  //filterValue:string = '';
  hasOverride:boolean=false;
  
  disableAdd = false;
  disableClear = false;
  disableUpdate = true;
  disableDelete = true;
  selectedProductID:string;
  
  
  constructor(private _dataService:PurchasedataService) { }

  ngOnInit() {
    this.selectedProduct.Cost=null;
    this.hasOverride=true;
    this.getData();
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

  getData(){
    let filterQuery='';
    let filterOp = 'contains'; //'gte';
    let filterIndex=0;

    let self = this;
    let pageSize = this.pageSize;


    //filterQuery+=`&filter[logic]=and&filter[filters][${filterIndex}][field]=UserId&filter[filters][${filterIndex}][operator]=eq&filter[filters][${filterIndex}][value]=${this.selectedPerson.id}`;
    //var filterParams = `page=${this.currentPage}&pageSize=${this.pageSize}&sort[0][field]=${this.sortColumn}&sort[0][dir]=${this.sortDirection}${filterQuery}`;
    
    var filterParams = `page=${this.currentPage}&pageSize=${this.pageSize}&sort[0][field]=${this.sortColumn}&sort[0][dir]=${this.sortDirection}`;
    forkJoin(
      this._dataService.getCategories(null),
      this._dataService.getCategoryXref(null),
      this._dataService.getProducts(filterParams)
      // getMultiValueObservable(), forkJoin on works for observables that complete
    ).subscribe(([cat, catX, prod]) => {
      this.Categorys=cat.body;
      this.CategoryXrefs=catX.body;
  
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
        //this.setPage();
      },
      err => {
        console.log("Error from multi subscribe", err)
      });

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
    //this.pagedItems = this.Products.slice(this.currentPage*this.pageSize, this.currentPage*this.pageSize + this.pageSize);
    //console.log("this.pagedItems=",this.pagedItems);
    this.getData();
  }

  goToLink(prod) {
    let self= this;
    console.log("goToLink prod", prod);

    this.selectedProduct = prod;

    
    if (this.selectedProduct.Cost==null)
      this.hasOverride=true;
    else
      this.hasOverride=false;
      

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


  SaveProduct() {
    console.log("Update selectedProduct", this.selectedProduct);

    if (this.selectedProduct.Title==""){
      this.message="An Item Title is required";
      return;
    }

    if (this.selectedProduct.Count===0){
      this.message="An Item Count is required";
        return;
    }

    if (this.selectedProduct.Cost!=null && this.selectedProduct.Cost===0){
      this.message="An Item Cost is required";
      return;
    }

    //**********First save xrefs
    var checkedCats = <Category[]> _.reduce(this.Categorys, function(memo, cat, idx) {
      //console.log("saveProduct cat=",cat);
      if (cat.wasChecked) {
        memo.push(cat);
      }
      return memo;
    }, []);
    
    console.log("SaveProduct checkedCats",checkedCats);
    if (checkedCats!=null && checkedCats.length>0) {
      this._dataService.saveCategoryXref(this.selectedProduct.ProductID,  checkedCats)
      .subscribe(res => {
        console.log("saveProduct saveCategoryXref=",res);
        this.getData();
      },
      error  => {
        console.log("SaveProduct response error", error);
        this.message=error.error.CategoryXrefPut;
      });
    }
//*********** testing
    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;

    this.selectedProduct = new Product();
    this.selectedProduct.Cost=null;
    this.hasOverride=true;
    return;
//*********** testing


    //**********Next save product
    this._dataService.saveProduct(this.selectedProduct)
    .subscribe(res => {
      this.message="Saved!!!";
      console.log("saveProduct=",res);
      this.getData();
    },
    error  => {
      console.log("SaveProduct response error", error);
      this.message=error.statusText;
    });


    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;

    this.selectedProduct = new Product();
    this.selectedProduct.Cost=null;
    this.hasOverride=true;
  
  }

  DeleteProduct() {
    console.log("Delete selectedProduct", this.selectedProduct);

    if (this.selectedProduct.ProductID==0){
      this.message="A Product must be selected";
      return;
    }
  
    this._dataService.deleteProduct(this.selectedProduct)
    .subscribe(res => {
      this.message="Deleted!!!";
      console.log("deleteProct=",res);
      this.getData();
    },
    error  => {
      console.log("DeleteProduct response error", error);
      this.message=error.statusText;
    });


    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;

    this.selectedProduct = new Product();
    this.selectedProduct.Cost=null;
    this.hasOverride=true;
   
  }

  ClearProduct() {
    this.message="";
    this.selectedProduct=new Product();
    this.selectedProduct.Cost=null;

    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;
  
    _.reduce(this.Categorys, function(memo, cat1, idx) {
          cat1.wasChecked=false;
    }, []);

  }

  overrideChange() {
    console.log("Update selectedProduct", this.selectedProduct);
    if (this.hasOverride)
      this.selectedProduct.Cost=null;
      else
      this.selectedProduct.Cost=0;
      //[checked]="hasOverride"
  }
}

import { Component, OnInit } from '@angular/core';
import  * as _ from 'lodash';

import { PurchasedataService } from '../Purchasedata.service';
import { Product } from '../Model/Product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  Products : Product[] = [];
  pagedItems: any[];
  selectedProduct: Product = new Product();
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
    this.selectedProduct.Cost=0;
    let self = this;
    let pageSize = this.pageSize;
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


    });

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
    console.log("goToLink prod", prod);

    this.selectedProduct = prod;

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
  
  }

}

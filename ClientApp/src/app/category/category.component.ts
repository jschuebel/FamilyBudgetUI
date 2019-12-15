import { Component, OnInit } from '@angular/core';
import  * as _ from 'lodash';

import { PurchasedataService } from '../Purchasedata.service';
import { Category } from '../Model/Category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  Categories : Category[] = [];
  pagedItems: any[];
  selectedCategory: Category = new Category();
  currentPage = 0;
  pageSize = 10;
  numberOfPages=0;
  disableAdd = false;
  disableClear = false;
  disableUpdate = true;
  disableDelete = true;
  selectedCategoryID:string;
  
  constructor(private _dataService:PurchasedataService) { }

  ngOnInit() {
    let self = this;
    let pageSize = this.pageSize;
    this._dataService.getCategories(null)
    .subscribe(resProd => {
      this.Categories = resProd.body;
      let total : number =  + resProd.headers.get('X-Total-Count');
      console.log("Products",this.Categories);
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
    this.selectedCategoryID = purch.ProductID;
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

    console.log("sePage len=",this.Categories.length, "  currpage=", this.currentPage, "   pagesize=", this.pageSize, "    numberOfPages=", this.numberOfPages);
    this.pagedItems = this.Categories.slice(this.currentPage*this.pageSize, this.currentPage*this.pageSize + this.pageSize);
    console.log("this.pagedItems=",this.pagedItems);
  }

  goToLink(prod) {
    console.log("goToLink prod", prod);

    this.selectedCategory = prod;

    this.disableAdd = true;
    this.disableUpdate = false;
    this.disableDelete = false;
  }


  UpdateCategory() {
    console.log("Update selectedProduct", this.selectedCategory);

    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;
  
  }

  ClearCategory() {
    this.selectedCategory=new Category();
    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;
  
  }


}

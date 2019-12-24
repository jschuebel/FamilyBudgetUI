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
  //pagedItems: any[];
  selectedCategory: Category = new Category();
  
  currentPage = 0;
  pageSize = 10;
  numberOfPages=0;
  sortColumn: string = 'Title';
  sortDirection : string = "asc";
  //filterField:string = 'Date';
  //filterValue:string = '';

  disableAdd = false;
  disableClear = false;
  disableUpdate = true;
  disableDelete = true;
  selectedCategoryID:string;
  message: string;
  
  constructor(private _dataService:PurchasedataService) { }

  ngOnInit() {
    this.selectedCategory.CategoryID=0;
    this.getData();
  }

  getData() {
    let self = this;

    let filterQuery='';
    let filterOp = 'contains'; //'gte';
    let filterIndex=0;

    let pageSize = this.pageSize;


    //filterQuery+=`&filter[logic]=and&filter[filters][${filterIndex}][field]=UserId&filter[filters][${filterIndex}][operator]=eq&filter[filters][${filterIndex}][value]=${this.selectedPerson.id}`;
    //var filterParams = `page=${this.currentPage}&pageSize=${this.pageSize}&sort[0][field]=${this.sortColumn}&sort[0][dir]=${this.sortDirection}${filterQuery}`;
    
    var filterParams = `page=${this.currentPage}&pageSize=${this.pageSize}&sort[0][field]=${this.sortColumn}&sort[0][dir]=${this.sortDirection}`;

    this._dataService.getCategories(filterParams)
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
      //this.setPage();
    });

  }

  highlightRow(cat) {
    this.selectedCategoryID = cat.CategoryID;
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
    //this.pagedItems = this.Categories.slice(this.currentPage*this.pageSize, this.currentPage*this.pageSize + this.pageSize);
    //console.log("this.pagedItems=",this.pagedItems);
    this.getData();
  }

  goToLink(prod) {
    console.log("goToLink prod", prod);

    this.selectedCategory = prod;

    this.disableAdd = true;
    this.disableUpdate = false;
    this.disableDelete = false;
  }


  SaveCategory() {
    console.log("Update selectedProduct", this.selectedCategory);


    if (this.selectedCategory.Title==null || this.selectedCategory.Title==""){
      this.message="An Item Title is required";
      return;
    }

    this._dataService.saveCategory(this.selectedCategory)
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
    this.selectedCategory=new Category();
    this.selectedCategory.CategoryID=0;
  
  }

  DeleteCategory() {
    console.log("Delete selectedProduct", this.selectedCategory);

    if (this.selectedCategory.CategoryID==0){
      this.message="A Category must be selected";
      return;
    }
  
    this._dataService.deleteCategory(this.selectedCategory)
    .subscribe(res => {
      this.message="Deleted!!!";
      console.log("deleteCategory=",res);
      this.getData();
    },
    error  => {
      console.log("DeleteCategory response error", error);
      this.message=error.statusText;
    });


    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;

    this.selectedCategory = new Category();
    this.selectedCategory.CategoryID=0;
  }


  ClearCategory() {
    this.message="";
    this.selectedCategory=new Category();
    this.selectedCategory.CategoryID=0;
    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;
  
  }


}

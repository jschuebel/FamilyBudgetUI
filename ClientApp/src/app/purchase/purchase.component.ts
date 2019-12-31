import { Component, OnInit } from '@angular/core';
import  * as _ from 'lodash';

import { PurchasedataService } from '../Purchasedata.service';
import { Product } from '../Model/Product';
import { Purchase } from '../Model/Purchase';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  Purchases : Purchase[] = [];
  selectedPurchase: Purchase = new Purchase();
  //pagedItems: any[];
  Products : Product[] = [];
  selectedProduct: Product;
  message: string;

  currentPage = 0;
  pageSize = 10;
  numberOfPages=0;
  sortColumn: string = 'PurchaseDate';
  sortDirection : string = "desc";
  //filterField:string = 'Date';
  //filterValue:string = '';

  disableAdd = false;
  disableClear = false;
  disableUpdate = true;
  disableDelete = true;
  selectedPurchaseID:string;
  
  constructor(private _dataService:PurchasedataService) { }

  padright(val, paddval) {
    return String(val + paddval).substring(0,paddval.length);
  }


  ngOnInit() {
    this.getData();
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
    this._dataService.getProducts(null)
    .subscribe(resProd => {

      var p = new Product();
      p.ProductID=-1;
      p.DisplayText="Title...............Count..Cost";
      resProd.body.unshift(p)
      this.selectedProduct=p;

      //this.Products = resProd.body;
      this.Products = <Product[]> _.reduce(resProd.body, function(memo, pr, idx) {
        let titl = self.padright(pr.Title, '....................');
        let cnt = self.padright(pr.Count, '.......');
        const mpr = new Product(pr);
        if (mpr.ProductID!=-1) {
          mpr.DisplayText = `${titl}${cnt}${mpr.Cost==null?'OVRIDE':mpr.Cost}`
          memo.push(mpr);
        }
        return memo;
      }, []);


      console.log("Products=",this.Products);
      console.log('Products header rowtotal', resProd.headers.get('X-Total-Count'));

      this._dataService.getPurchases(filterParams)
      .subscribe((resPurch) => {
        console.log("resPurch", resPurch);
        //console.log("Current typeof resPurch", typeof(resPurch));
        //console.log("Current resPurch.body", typeof(resPurch.body));


        console.log('Purchases header rowtotal', resPurch.headers.get('X-Total-Count'));
        let total : number =  + resPurch.headers.get('X-Total-Count');
        console.log("Purchases from body", resPurch.body);
          this.Purchases = <Purchase[]> _.reduce(resPurch.body, function(memo, purch, idx) {
          //console.log("Current purch", purch);
          //console.log("Current purch", typeof(purch));
          const mpurch = new Purchase(purch);
          //console.log("Current idx", idx);
         
          //console.log("Current purch.PurchaseID)", mpurch.PurchaseID);
          //console.log("Current purch.ProductID", mpurch.ProductID);
          
          let selProduct = <Product> _.find(resProd.body, [ 'ProductID', mpurch.ProductID]);
          //console.log("Product FOUND ", selectedProduct);
          
            if (selProduct!=null) {
                mpurch.BuildPurchase(selProduct);
                //console.log("after Build Purch!!!! ", mpurch);
                memo.push(mpurch);
            }
          return memo;
        }, []);

        console.log("Purchases BUILT",this.Purchases);
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
        console.log("Error from getPurchases", err)
      });

    },
    err => {
      console.log("Error from getProducts", err)
    });
  }

  public highlightRow(purch) {
    this.selectedPurchaseID = purch.PurchaseID;
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

    console.log("sePage len=",this.Purchases.length, "  currpage=", this.currentPage, "   pagesize=", this.pageSize, "    numberOfPages=", this.numberOfPages);
    //this.pagedItems = this.Purchases.slice(this.currentPage*this.pageSize, this.currentPage*this.pageSize + this.pageSize);
    //console.log("this.pagedItems=",this.pagedItems);
    this.getData();
  }


  ClearPurchase() {
    this.selectedPurchase = new Purchase();
    //console.log("ClearPurchase product", this.selectedProduct);
    this.selectedProduct=this.Products[0];
    console.log("ClearPurchase product", this.selectedProduct);

    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;
  
  }


  SavePurchase() {
    console.log("SavePurchase purchase", this.selectedPurchase);
    console.log("SavePurchase product", this.selectedProduct);

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

    if (this.selectedProduct.Cost==null && (this.selectedPurchase.CostOverride==null || (this.selectedPurchase.CostOverride!=null && this.selectedPurchase.CostOverride===0))){
      this.message="A Cost Override is required";
      return;
    }

    this.selectedPurchase.ProductID=this.selectedProduct.ProductID;
    this._dataService.savePurchase(this.selectedPurchase)
    .subscribe(res => {
      this.message="Saved!!!";
      console.log("savePurchase=",res);
      this.getData();
    },
    error  => {
      console.log("SavePurchase response error", error);
      this.message=error.statusText;
    });


    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;

    this.selectedPurchase = new Purchase();
    //console.log("ClearPurchase product", this.selectedProduct);
    this.selectedProduct=this.Products[0];
  
  }

  DeletePurchase() {
    console.log("Delete selectedPurchase", this.selectedPurchase);

    if (this.selectedPurchase.PurchaseID==0){
      this.message="A Purchase must be selected";
      return;
    }
  
    this._dataService.deletePurchase(this.selectedPurchase)
    .subscribe(res => {
      this.message="Deleted!!!";
      console.log("deletePurchase=",res);
      this.getData();
    },
    error  => {
      console.log("DeletePurchase response error", error);
      this.message=error.statusText;
    });


    this.disableAdd = false;
    this.disableUpdate = true;
    this.disableDelete = true;

    this.selectedPurchase = new Purchase();
    this.selectedProduct=this.Products[0];
    console.log("SavePurchase product", this.selectedProduct);

  }


  goToLink(purch) {
    console.log("goToLink purch", purch);

    if (purch.PurchaseDate!=null && purch.PurchaseDate.indexOf("T") > 0)
      purch.PurchaseDate = purch.PurchaseDate.substr(0,purch.PurchaseDate.indexOf("T"));

    this.selectedPurchase = purch;
    this.selectedProduct = <Product> _.find(this.Products, [ 'ProductID', purch.ProductID]);
    console.log("goToLink product", this.selectedProduct);

    if (this.selectedProduct.Cost!=null)
      this.selectedPurchase.CostOverride=null;

    this.disableAdd = true;
    this.disableUpdate = false;
    this.disableDelete = false;
  }


}

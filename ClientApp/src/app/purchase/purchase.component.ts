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
  Products : Product[] = [];
  currentPage = 1;
  pageSize = 10;
  numberOfPages=0;



  constructor(private _dataService:PurchasedataService) { }

  ngOnInit() {
    let pageSize = this.pageSize;
    this._dataService.getProducts()
    .subscribe(resProd => {
      this.Products = resProd.body;
      console.log("Products=",this.Products);
      console.log('Products header rowtotal', resProd.headers.get('X-Total-Count'));

      this._dataService.getPurchases()
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
          console.log("Current idx", idx);
         
          //if (idx< pageSize)
{
          //console.log("Current purch.PurchaseID)", mpurch.PurchaseID);
          //console.log("Current purch.ProductID", mpurch.ProductID);
          
          let selectedProduct = <Product> _.find(resProd.body, [ 'ProductID', mpurch.ProductID]);
          //console.log("Product FOUND ", selectedProduct);
          
            if (selectedProduct!=null) {
                mpurch.BuildPurchase(selectedProduct);
                //console.log("after Build Purch!!!! ", mpurch);
                memo.push(mpurch);
            }
          }
          return memo;
        }, []);

        console.log("Purchases BUILT",this.Purchases);
        if (total>0 && total < this.pageSize)
        this.numberOfPages = 1;
      else
        this.numberOfPages = Math.round(total / this.pageSize);
      console.log("numberOfPages=",this.numberOfPages, "total returned",total);


      },
      err => {
        console.log("Error from getPurchases", err)
      });

    },
    err => {
      console.log("Error from getProducts", err)
    });

  }

}

import { Product } from '../Model/Product';

export interface IPurchase {
    PurchaseID:number;
    Count:number;
    Cost:number;
    CostOverride:number;
    PurchaseDate:Date;

    //Product info
    ProductID:number;
    UnitCount:number;
    UnitCost:number;
    Title: string;

    BuildPurchase(prod:Product);
}

export class Purchase implements IPurchase {
    PurchaseID:number;
    Count:number;
    Cost:number;
    CostOverride:number;
    PurchaseDate:Date;

    //Product info
    ProductID:number;
    UnitCount:number;
    UnitCost:number;
    Title: string;

    formatter = new Intl.NumberFormat('en-US', { style:'currency', currency: 'USD'});

    constructor();
    constructor(obj: Purchase); 
    constructor(obj?: any) {    
        this.PurchaseID = obj && obj.PurchaseID || 0
        this.ProductID = obj && obj.ProductID || 0
        this.Count = obj && obj.Count || 0
        this.PurchaseDate = obj && obj.PurchaseDate || 0
        this.CostOverride = obj && obj.CostOverride || 0
        
    }   

    CostFormatted() {
        return this.formatter.format(this.Cost);
      }

      UnitCostFormatted() {
        if (this.UnitCost==null) return "N/A";
        return this.formatter.format(this.UnitCost);
      }
    
    BuildPurchase(prod:Product) {
        this.UnitCount=prod.Count;
        this.UnitCost=prod.Cost;
        this.Title=prod.Title;
        if (this.CostOverride!=0)
            this.Cost = this.Count * this.CostOverride;
        else
            this.Cost = this.Count * prod.Cost;

        return;
    }
  };

 
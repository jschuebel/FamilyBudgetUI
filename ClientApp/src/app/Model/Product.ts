export class Product {
    ProductID:number = -1;
    Count:number;
    Cost:number;
    Title: string;
    DisplayText: string;
    formatter = new Intl.NumberFormat('en-US', { style:'currency', currency: 'USD'});
    wasChecked:boolean;

    constructor();
    constructor(obj: Product); 
    constructor(obj?: any) {    
        this.ProductID = obj && obj.ProductID || 0
        this.Count = obj && obj.Count || 0
        this.Title = obj && obj.Title || ''
        this.Cost = obj && obj.Cost || null
        
    }   

    CostFormatted() {
      if (this.Cost==null) return "N/A";
      return this.formatter.format(this.Cost);
    }
  };

 
export class Product {
    ProductID:number;
    Count:number;
    Cost:number;
    Title: string;
    DisplayText: string;
    formatter = new Intl.NumberFormat('en-US', { style:'currency', currency: 'USD'});

    constructor();
    constructor(obj: Product); 
    constructor(obj?: any) {    
        this.ProductID = obj && obj.ProductID || 0
        this.Count = obj && obj.Count || 0
        this.Title = obj && obj.Title || ''
        this.Cost = obj && obj.Cost || 0
        
    }   

    CostFormatted() {
      if (this.Cost==null) return "N/A";
      return this.formatter.format(this.Cost);
    }
  };

 
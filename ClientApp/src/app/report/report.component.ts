import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import  * as _ from 'lodash';
import { PurchasedataService } from '../Purchasedata.service';
//import { Product } from '../Model/Product';
import { Category } from '../Model/Category';
//import { CategoryXref } from '../Model/CategoryXref';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;  
  Categories: Category[];
  selectedCategory: Category = null;
  selectedReportBar:boolean = true;
  selectedReportLine:boolean = false;

  // get the element with the #chessCanvas on it
  @ViewChild("purchasesCanvas", {static: false}) purchasesCanvas: ElementRef; 

  constructor(private _dataService:PurchasedataService) { }

  ngOnInit() {
    this._dataService.getCategories(null)
    .subscribe(cat => {

      var p = new Category();
      p.CategoryID=-1;
      p.Title="Select Category";
      cat.body.unshift(p)
      this.selectedCategory=p;
      this.Categories=cat.body;
      console.log("Categories=",this.Categories);
    },
    err => {
      console.log("Error from getCategorys", err)
    });


  }

  ngAfterViewInit() { // wait for the view to init before using the element
    this.canvas = this.purchasesCanvas.nativeElement;
    this.context = this.canvas.getContext("2d");
  }


  GenerateReport() {
      //    if (this.isFilteringRequest)
      //    filterQuery=`&filter[logic]=and&filter[filters][0][field]=${this.filterField}&filter[filters][0][operator]=${filterOp}&filter[filters][0][value]=${this.filterValue}`;
      //  var filterParams = `page=${this.currentPage}&pageSize=${this.pageSize}&sort[0][field]=${this.sortColumn}&sort[0][dir]=${this.sortDirection}${filterQuery}`;
      //http://localhost:5002/api/report?page=0&pageSize=99&sort[0][field]=PurchaseDate&sort[0][dir]=desc&filter[logic]=and&filter[filters][0][field]=CategoryID&filter[filters][0][operator]=eq&filter[filters][0][value]=2
      var filterParams = `page=0&pageSize=99&sort[0][field]=PurchaseDate&sort[0][dir]=asc&filter[logic]=and&filter[filters][0][field]=CategoryID&filter[filters][0][operator]=eq&filter[filters][0][value]=${this.selectedCategory.CategoryID}`
      this._dataService.getReport(filterParams)
      .subscribe(rptdata => {
        console.log("CategoryChange rptdata=",rptdata);
        if (this.selectedReportLine)
          this.drawGraph(rptdata);

        //let dataArr = [];
        //  let rptRow = {month : 1, monthYear : "11/12/2019", Cost : 46};
        //  dataArr.push(rptRow);

        //  let rptRow2 = {monthYear : "12/2019", Cost : 146};
        //  dataArr.push(rptRow2);
        if (this.selectedReportBar) {
          let options = {padding:30, gridScale:25, gridColor:"#67b6c7", data:rptdata};
          this.drawBarchart(options);
        }

      },
      err => {
        console.log("Error from getCategorys", err)
      });

  }
  
  CategoryChange() {
    console.log("CategoryChange selectedCategory=",this.selectedCategory);
    this.GenerateReport();
  }
  
  ReportTypeChange() {
    this.selectedReportBar=!this.selectedReportBar;
    this.selectedReportLine=!this.selectedReportLine;
    console.log("selectedReportBar", this.selectedReportBar)
    console.log("selectedReportLine", this.selectedReportLine)
    console.log("CategoryChange selectedCategory=",this.selectedCategory);
    if (this.selectedCategory.CategoryID!=-1)
      this.GenerateReport();
  }

  drawGraph(dataArr) {
    //let dataArr = [];
    //let rptRow = {monthYear : "11/2019", Cost : 46};
    //dataArr.push(rptRow);

    //let rptRow2 = {monthYear : "12/2019", Cost : 146};
    //dataArr.push(rptRow2);


    var GRAPH_TOP = 25;      
    var GRAPH_BOTTOM = 375;      
    var GRAPH_LEFT = 25;      
    var GRAPH_RIGHT = 575; // 475;        
    var GRAPH_HEIGHT = 350;      
    var GRAPH_WIDTH = 750; //450;       
    var arrayLen = dataArr.length;        
    let largest = 0;     
    for( var i = 0; i < arrayLen; i++ )
    {          
        
        if( dataArr[ i ].Cost > largest )
        {              
            largest = dataArr[ i ].Cost;
        }      
    }
    this.context.clearRect( 0, 0, 700, 450 );      
        // set font for fillText()      
        this.context.font = "16px Arial";            
        // draw X and Y axis      
        this.context.beginPath();      
        this.context.moveTo( GRAPH_LEFT, GRAPH_BOTTOM );      
        this.context.lineTo( GRAPH_RIGHT, GRAPH_BOTTOM );      
        this.context.lineTo( GRAPH_RIGHT, GRAPH_TOP );      
        this.context.stroke();             
        // draw reference line      
        this.context.beginPath();      
        this.context.strokeStyle = "#BBB";      
        this.context.moveTo( GRAPH_LEFT, GRAPH_TOP );      
        this.context.lineTo( GRAPH_RIGHT, GRAPH_TOP );      
        
        
        // draw reference value for hours      
        this.context.fillText( largest + "", GRAPH_RIGHT + 15, GRAPH_TOP);      
        this.context.stroke();         
        // draw reference line      
        this.context.beginPath();      
        this.context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP );      
        this.context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP );      
        // draw reference value for hours      
        this.context.fillText( Math.round(largest / 4) + ".00", GRAPH_RIGHT + 15, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP);      
        this.context.stroke();        
        // draw reference line      
        this.context.beginPath();      
        this.context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP );      
        this.context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP );      
        // draw reference value for hours      
        this.context.fillText( Math.round(largest / 2) + ".00", GRAPH_RIGHT + 15, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP);      
        this.context.stroke();         
        // draw reference line      
        this.context.beginPath();      
        this.context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP );      
        this.context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP );      
        // draw reference value for hours      
        this.context.fillText( Math.round(largest / 4 * 3) + ".00", GRAPH_RIGHT + 15, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP);      
        this.context.stroke();        


        // draw titles      
        this.context.fillText( "Month/Year", GRAPH_RIGHT / 3, GRAPH_BOTTOM + 50);      
        this.context.fillText( "Cost", GRAPH_RIGHT + 30, GRAPH_HEIGHT / 2);        
        this.context.beginPath();      
        this.context.lineJoin = "round";      
        this.context.strokeStyle = "black"; 
        this.context.font = "12px Arial";       
        this.context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT - dataArr[ 0 ].Cost / largest * GRAPH_HEIGHT ) + GRAPH_TOP );      
        // draw reference value for day of the week   
        this.context.fillText( dataArr[ 0 ].monthyear, 15, GRAPH_BOTTOM + 25);      
        for( var i = 1; i < arrayLen; i++ )
        {
          this.context.lineTo( GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT, ( GRAPH_HEIGHT - dataArr[ i ].Cost / largest * GRAPH_HEIGHT ) + GRAPH_TOP );          
            // draw reference value for day of the week          
            this.context.fillText(dataArr[i].monthyear, GRAPH_RIGHT / arrayLen * i, GRAPH_BOTTOM + 25);      
        }      
        this.context.stroke();  
  }



  drawLine(ctx, startX, startY, endX, endY,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
  }
 
  getRndColor() {
    var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  
  drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){
    ctx.save();
    ctx.fillStyle=color;
    ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    ctx.restore();
  }

  drawBarchart(options){

    var clientHeight=this.canvas.parentNode.parentElement.clientHeight;
    var clientWidth=this. canvas.parentNode.parentElement.clientWidth;
    console.log("clientWidth%5: ", clientWidth%5);

    this.context.clearRect( 0, 0, 700, 450 );      
        var maxValue = 0;
        for (var categ in options.data){
            maxValue = Math.max(maxValue,options.data[categ].Cost);
        }
        var canvasActualHeight = this.canvas.height - options.padding * 2;
        var canvasActualWidth = this.canvas.width - options.padding * 2;
 
        //drawing the grid lines
        let gridValue = 0;
        //console.log("!!!!!!!!!!!!!!!!!!!!!!! maxValue",maxValue);
        while (gridValue <= maxValue){
            var gridY = canvasActualHeight * (1 - gridValue/maxValue) + options.padding;
            //console.log("!!!!!!!!!!!!!!!!!!!!!!! gridY",gridY);
            this.drawLine(
                this.context,
                0,
                gridY,
                this.canvas.width,
                gridY,
                options.gridColor
            );

            //writing grid markers
            this.context.save();
            this.context.fillStyle = options.gridColor;
            this.context.textBaseline="bottom"; 
            this.context.font = "bold 10px Arial";
            this.context.fillText(gridValue+"", 10,gridY - 2);
            this.context.restore();
 
            gridValue+=options.gridScale;
        }      
  
  //  return;
        //drawing the bars
        var barIndex = 0;
        var numberOfBars = Object.keys(options.data).length;
        var barSize = (canvasActualWidth)/numberOfBars;
        //console.log("!!!!!!!!!!!!!!!!!!!!!!! barSize",barSize);

        options.data.forEach(categ => {
            var val = categ.Cost; //this.options.data[categ];
            var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
            this.drawBar(
                this.context,
                options.padding + barIndex * barSize,
                this.canvas.height - barHeight - options.padding,
                barSize,
                barHeight,
                this.getRndColor()
                //this.colors[barIndex%this.colors.length]
            );

            this.context.save();
            this.context.textBaseline="bottom";
            this.context.textAlign="center";
            this.context.fillStyle = "#000000";
            this.context.font = "bold 14px Arial";
            this.context.fillText(categ.monthyear, (options.padding + barIndex * barSize)+(15 + (barSize/4)),this.canvas.height);
            this.context.restore();  
    

 
            barIndex++;
        });
 
        /*drawing series name
        this.context.save();
        this.context.textBaseline="bottom";
        this.context.textAlign="center";
        this.context.fillStyle = "#000000";
        this.context.font = "bold 14px Arial";
        for (categ in this.options.data){
            this.context.fillText(categ, this.canvas.width/2,this.canvas.height);
        }
        this.context.restore();  
         */
        /*draw legend
        barIndex = 0;
        var legend = document.querySelector("legend[for='purchasesCanvas']");
        var ul = document.createElement("ul");
        legend.append(ul);
        for (categ in this.options.data){
            var li = document.createElement("li");
            li.style.listStyle = "none";
            li.style.borderLeft = "20px solid "+this.colors[barIndex%this.colors.length];
            li.style.padding = "5px";
            li.textContent = categ;
            ul.append(li);
            barIndex++;
        }
        */
    }



}

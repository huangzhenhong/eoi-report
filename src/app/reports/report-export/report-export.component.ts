import { 
  Component, 
  OnInit,
  trigger,
  state,
  style,
  transition,
  animate
    } from '@angular/core';
import { Http } from '@angular/http';
import { ReportsService } from '../reports.service';
import { ExportReport } from '../models/ExportReport';
import { CommonService } from '../common.service';
import { Organization } from '../models/Organization';
import { Period } from '../models/Period';
import { GridOptions } from 'ag-grid/main';
import { Angular2Csv  } from '../_helpers/angular2-csv';
import { Subscription } from 'rxjs';

@Component({
  selector: 'eo-report-export',
  template:require('./report-export.component.html'),
  animations:[
    trigger('gridDiv',[
      state('in', style({
        opacity:1,
        transform: 'translateX(0)'
      })),
      transition('void=>*',[
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(600)
      ]),
      transition('* => void',[
        animate(600, style({
          transform: 'translateX(100px)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class ReportExportComponent implements OnInit { 

  busy: Subscription;
  private periods: Period[] = [];
  private organizations: Organization[] = [];
  private selectedPeriod: string = "Select Period";
  private selectedOrganization: string = "Select Organization";
  private param: QueryParameter;
  private isScorllRequired: boolean = false;

  public rowCount:string;
  private rowData: any[];
  public gridOptions: GridOptions;
  public showGrid: boolean;

  constructor(private itemService: ReportsService, private commonService: CommonService){
    this.gridOptions = <GridOptions>{};
    this.gridOptions.rowData = this.rowData;
    this.gridOptions.columnDefs = this.createColumnDefs();
    this.showGrid = false;
    this.param = new QueryParameter();
  }

 ngOnInit():void{
    this.loadPeriods();
    this.loadOrganizations();
  }

  private createColumnDefs() {
    return [
      {headerName: 'Period', field: 'period', width: 100, pinned: true},
      {headerName: 'Org', field: 'organizationName', width:80, pinned: true},
      {headerName: 'Part #', field: 'itemName', width:120, pinned: true},
      {headerName: 'ABC Class', field: 'abcCode', width:100},
      {headerName: 'Annual Usage Pieces', field: 'annualUsagePieces', width:180},
      {headerName: 'Cost', field: 'itemCost', width:100, cellRenderer: this.actualCurrencyCellRenderer},
      {headerName: 'Scheduled Receipts', field: 'scheduledReceipts', width:160},
      {headerName: 'Qty In Rec', field: 'qtyInRec', width:110},
      {headerName: 'Nettable OH', field: 'nettable_OH', width:120},
      {headerName: 'Excess Qty', field: 'excessQty', width:110},
      {headerName: 'Total INV', field: 'totalInventory', width:90},
      {headerName: 'Excess Inv Qty', field: 'excessInventoryQty', width:130},
      {headerName: 'Excess Qty on Order', field: 'excessQtyOnOrder', width:170},
      {
        headerName: 'Excess Inv $$', 
        field: 'excessInventoryCost', 
        width:120, 
        cellRenderer: this.actualCurrencyCellRenderer
      },
      {
        headerName: 'Excess $$ on Order', 
        field: 'excessOnOrderCost', 
        width:160, 
        cellRenderer: this.actualCurrencyCellRenderer
      },
      {
        headerName: 'D Inventory $', 
        field: 'dInventoryCost', 
        width:160, 
        cellRenderer: this.actualCurrencyCellRenderer
      },
      {
         headerName: 'Excess D Inv $ with No Annual Usage'
        ,field: 'excessDInventoryCostWithNoAnnualUsage'
        ,width:280
        ,cellRenderer: this.actualCurrencyCellRenderer
      },
      {
        headerName: 'Excess D on Order with No Annual Usage', 
        field: 'excessDOnOrderCostWithNoAnnualUsage', 
        width:300, 
        cellRenderer: this.actualCurrencyCellRenderer
      },
      {
        headerName: 'Excess D Inv $ excludes D USE', 
        field: 'excessDInventoryCostExcludesDUse', 
        width:280, 
        cellRenderer: this.actualCurrencyCellRenderer
      },
      {
        headerName: 'Excess D On Order $ exclude D USE', 
        field: 'excessDOnOrderCostExcludesDUse', 
        width:280, 
        cellRenderer: this.actualCurrencyCellRenderer
      },
      {
        headerName: 'Future Planned Orders Excess $', 
        field: 'futurePlannedOrdersExcess', 
        width:240,
        cellRenderer: this.actualCurrencyCellRenderer
      },
    ];
  }

  // cell render for ag grid to format decimal data to currency
    private actualCurrencyCellRenderer(params:any) {
      var usdFormate = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
      });
      return usdFormate.format(params.value);
    }

  public LoadReport(){
    this.createRowData();
    this.showGrid = true;
  }

  loadOrganizations():void{
    this.commonService.loadOrganizations()
      .subscribe((data: Organization[]) => this.organizations = data)
  }

  loadPeriods():void{
    this.commonService.loadWeeklyPeriods()
    .subscribe(
      (data:Period[]) => {
        this.periods = data;
      });
    if(this.periods.length > 20){
      this.isScorllRequired = true;
    }
  }

  public createRowData(){
   this.busy = this.itemService.getExportReport(this.param.period,this.param.organizationId).subscribe(
      (data:ExportReport[]) => {
        this.rowData = data
        //console.log(this.rowData);
      }
    );

  }

  private onModelUpdated() {
      //console.log('onModelUpdated');
      this.calculateRowCount();
  }

  private onReady() {
      //console.log('onReady');
      this.calculateRowCount();
  }

  private calculateRowCount() {
    if (this.gridOptions.api && this.rowData) {
        var model = this.gridOptions.api.getModel();
        var totalRows = this.rowData.length;
        var processedRows = model.getRowCount();
        this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
  }


  public onPeriodChange(period: any){
    if(period !== 0){
      this.selectedPeriod = period.date.toString();
    }else{
      this.selectedPeriod = "Select Period";
    }
    this.param.period = period.period;
    console.log(period.period);
  }

  public onOrganizationChange(orgId:number, organizationCode: string){
    if(orgId !== 0){
      this.selectedOrganization = organizationCode;
    }else{
      this.selectedOrganization = "Select Organization";
    }
    //console.log(orgId);
    this.param.organizationId = orgId;
  }

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  Export(){
    console.log("Exporting data");
    
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'EOI Raw Data'
    };

     new Angular2Csv(this.rowData,'EOI Raw Data',options);
  }
}
export class QueryParameter{
  period: number;
  organizationId: number;
}

function percentCellRenderer(params) {
  var value = params.value;

  var eDivPercentBar = document.createElement('div');
  eDivPercentBar.className = 'div-percent-bar';
  eDivPercentBar.style.width = value + '%';
  if (value < 20) {
    eDivPercentBar.style.backgroundColor = 'red';
  } else if (value < 60) {
    eDivPercentBar.style.backgroundColor = '#ff9900';
  } else {
    eDivPercentBar.style.backgroundColor = '#00A000';
  }

  var eValue = document.createElement('div');
  eValue.className = 'div-percent-value';
  eValue.innerHTML = value + '%';

  var eOuterDiv = document.createElement('div');
  eOuterDiv.className = 'div-outer-div';
  eOuterDiv.appendChild(eValue);
  eOuterDiv.appendChild(eDivPercentBar);

  return eOuterDiv;
}
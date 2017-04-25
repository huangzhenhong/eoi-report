import { Component, 
  OnInit,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import { Http } from '@angular/http';
import { ReportsService } from '../reports.service';
import { CommonService } from '../common.service';
import { Organization } from '../models/Organization';
import { Period } from '../models/Period';
import { DetailReport } from '../models/DetailReport';
import { GridOptions } from 'ag-grid/main';
import { Angular2Csv  } from '../_helpers/angular2-csv';
import { Subscription } from 'rxjs';

@Component({
  selector: 'eo-report-detail',
  template:require('./report-detail.component.html'),
  styleUrls: ['./report-detail.component.css'],
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
export class ReportDetailComponent implements OnInit { 

  busy: Subscription;
  private selectedPeriod1: string = "Select Period 1";
  private selectedPeriod2: string = "Select Period 2";
  private selectedOrganization: string = "Select Organization";
  private param: QueryParameter;
  private isScorllRequired: boolean = false;

  private isFormValid:boolean = true;
  private message: string = "";

  private periods: Period[] = [];
  private organizations: Organization[] = [];
  private reports: DetailReport[];
  private rowData: any[];
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowCount:string;

  constructor(private commonService: CommonService, 
                  private reportService: ReportsService){
    this.gridOptions = <GridOptions>{};
    this.gridOptions.rowData = this.rowData;
    this.gridOptions.columnDefs = this.createColumnDefs();
    this.showGrid = false;
    this.param = new QueryParameter();
  }

  LoadReport(){
    //console.log(this.param);
    this.ValidateForm();
    if(this.isFormValid){
      this.createRowData();
      this.showGrid = true;
    }
  }

  ngOnInit(){
    this.loadPeriods();
    this.loadOrganizations();
  }

  private createColumnDefs() {
    return [
        {headerName: "Part Number", field: "item_name", width: 120, pinned: true},
        {
          headerName: "First Period",
          children: [
            {headerName: "Date", field: "p1_Date", width: 80},
            {
              headerName: "Cost", 
              field: "p1_ItemCost", 
              width: 80,
              cellRenderer: this.actualCurrencyCellRenderer
            },
            {headerName: "Scheduled receipts", field: "p1_ScheduledReceipts", width: 140},
            {headerName: "Qty In Rec", field: "p1_QtyInRec", width: 100},
            {headerName: "Nettable OH", field: "p1_Nettable_OH", width: 120},
            {headerName: "Total INV", field: "p1_TotalInventory", width: 80},
            {headerName: "Excess Qty", field: "p1_ExcessQty", width: 100},
            {headerName: "Excess Inv Qty", field: "p1_ExcessInventoryQty", width: 120},
            {headerName: "Excess Qty on Order", field: "p1_ExcessQtyOnOrder", width: 150},
            {headerName: 'ABC Class', field: 'p1_Abc_Code', width:100},
            {headerName: 'Annual Usage Pieces', field: 'p1_Annual_Usage_Pieces', width:180},
            {
              headerName: 'Future Planned Orders Excess $', 
              field: 'p1_Future_Planned_Orders_Excess', 
              width:220,
              cellRenderer: this.actualCurrencyCellRenderer
            },
          ]
        },
        {
          headerName: "Second Period",
          children: [
            {headerName: "Date", field: "p2_Date", width: 80},
            {
              headerName: "Cost", 
              field: "p2_ItemCost", 
              width: 80, 
              cellRenderer: this.actualCurrencyCellRenderer
            },
            {headerName: "Scheduled receipts", field: "p2_ScheduledReceipts", width: 140},
            {headerName: "Qty In Rec", field: "p2_QtyInRec", width: 100},
            {headerName: "Nettable OH", field: "p1_Nettable_OH", width: 120},
            {headerName: "Total INV", field: "p2_TotalInventory", width: 80},
            {headerName: "Excess Qty", field: "p2_ExcessQty", width: 100},
            {headerName: "Excess Inv Qty", field: "p2_ExcessInventoryQty", width: 120},
            {headerName: "Excess Qty on Order", field: "p2_ExcessQtyOnOrder", width: 150},
            {headerName: 'ABC Class', field: 'p2_Abc_Code', width:100},
            {headerName: 'Annual Usage Pieces', field: 'p2_Annual_Usage_Pieces', width:180},
            {
              headerName: 'Future Planned Orders Excess $', 
              field: 'p2_Future_Planned_Orders_Excess', 
              width:220,
              cellRenderer: this.actualCurrencyCellRenderer
            },
          ]
        },
        {
          headerName: "P1 - P2",
          children:[
            {headerName: "Excess Inv Qty", field: "p1_P2_ExcessInventoryOty", width: 120},
            {headerName: "Excess Qty on Order", field: "p1_P2_ExcessOtyonOrder", width: 150},
            {
              headerName: "Excess Inv $$", 
              field: "p1_P2_ExcessInvCost", 
              width: 120,
              cellRenderer: this.actualCurrencyCellRenderer
            },
            {
              headerName: "Excess $$ on Order", 
              field: "p1_P2_ExcessCostOnOrder", 
              width: 140,
              cellRenderer: this.actualCurrencyCellRenderer
            },
            {
              headerName: "Future Planned Orders Excess $",
              field: "p1_P2_Future_Planned_Orders_Excess",
              width: 220,
              cellRenderer: this.actualCurrencyCellRenderer
            }
          ]
        },
        {headerName: "Planner", field: "planner_code", width: 80},
        {headerName: "Planner Name", field: "planner_name", width: 120},
        {headerName: "Buyer", field: "buyer_name", width: 120},
        {headerName: "Make/Buy", field: "make_buy", width: 80},
        {headerName: "User Item Type", field: "item_type", width: 120},
        {headerName: "UOM", field: "uom", width: 80},
        {headerName: "Value Stream", field: "value_stream", width: 100},
        {headerName: "CalcROQ", field: "roq_calc", width: 80},
        {headerName: "Safety Stock Pieces", field: "safety_stock_Quantity", width: 150},
        {headerName: "Primary Supplier", field: "vendor_name", width: 160},
        {headerName: "Status Code", field: "inventory_item_status_code", width: 100},
        {headerName: "WIP Supply Type", field: "supply_type", width: 120},
        {headerName: "Material Description", field: "material_desc", width: 250},
        {headerName: "Addl Specs", field: "spec", width: 160},
        {headerName: "Pattern", field: "pattern", width: 80},
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

 private createRowData() {
       this.busy = this.reportService.getDetailReport(
            this.param.organizationId,
            this.param.period1,
            this.param.period2).subscribe(
          (results:any) =>  { 
              this.rowData = results;
              //console.log(results);
              this.summary(this.rowData);
            }
        );
    }
  
  private totalExInvCost : number = 0;
  private totalExCostOnOrder : number = 0;
  private totalExInvCostNoAnnualUsage : number = 0;
  private totalExCostOnOrderNoAnnualUsage : number = 0;
  private totalExInvCostExcludeD : number = 0;
  private totalExCostOnOrderExcludeD : number = 0;
  private totalFuturePlannedOrdersExcess: number = 0;

  private summary(data:any[]){
    let totalExInvCost: number = 0;
    let totalExCostOnOrder : number = 0;
    let totalExInvCostNoAnnualUsage : number =0;
    let totalExCostOnOrderNoAnnualUsage : number = 0;
    let totalExInvCostExcludeD: number =0;
    let totalExCostOnOrderExcludeD: number =0;
    let totalFuturePlannedOrdersExcess: number=0;
     for(let key in data){
        totalExInvCost += data[key].p1_P2_ExcessInvCost;
        totalExCostOnOrder += data[key].p1_P2_ExcessCostOnOrder;
        totalExInvCostNoAnnualUsage += data[key].p1_P2_Excess_Inv_Cost_No_Annual_Usage;
        totalExCostOnOrderNoAnnualUsage += data[key].p1_P2_Excess_On_Order_Cost_No_Annual_Usage;
        totalExInvCostExcludeD += data[key].p1_P2_Excess_Inv_Cost_exclude_D_USE;
        totalExCostOnOrderExcludeD += data[key].p1_P2_Excess_On_Order_Cost_exclude_D_USE;
        totalFuturePlannedOrdersExcess +=data[key].p1_P2_Future_Planned_Orders_Excess;
      }
      this.totalExInvCost = parseFloat(totalExInvCost.toFixed(2));
      this.totalExCostOnOrder = parseFloat(totalExCostOnOrder.toFixed(2));
      this.totalExInvCostNoAnnualUsage = parseFloat(totalExInvCostNoAnnualUsage.toFixed(2));
      this.totalExCostOnOrderNoAnnualUsage = parseFloat(totalExCostOnOrderNoAnnualUsage.toFixed(2));
      this.totalExInvCostExcludeD = parseFloat(totalExInvCostExcludeD.toFixed(2));
      this.totalExCostOnOrderExcludeD = parseFloat(totalExCostOnOrderExcludeD.toFixed(2));
      this.totalFuturePlannedOrdersExcess = parseFloat(totalFuturePlannedOrdersExcess.toFixed(2));
      //console.log(this.totalExInvCostExcludeD);
  }

  private onModelUpdated() {
      console.log('onModelUpdated');
      this.calculateRowCount();
  }

  private onReady() {
      console.log('onReady');
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

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
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

  private ValidateForm(){
    if(this.param.organizationId == 0){
      this.message = "Please select one organization from the list";
      this.isFormValid = false;
    }
    else if(this.param.period1 == 0){
      this.message = "Week Period 1 can't be empty";
      this.isFormValid = false;
    }
    else if(this.param.period2 == 0){
      this.message = "Week Period 2 can't be empty";
      this.isFormValid = false;
    }else{
      this.message = "";
      this.isFormValid = true;
    }
  }

  public onPeriod1Change(period:any){
    if(period !== 0){
      this.selectedPeriod1 = period.date.toString();
    }else{
      this.selectedPeriod1 = "Select Period 1";
    }
    this.param.period1 = period.period;
  }

  public onPeriod2Change(period:any){
    if(period !== 0){
      this.selectedPeriod2 = period.date.toString();
    }else{
      this.selectedPeriod2 = "Select Period 2";
    }
    this.param.period2 = period.period;
  }

  public onOrganizationChange(orgId:number, organizationCode: string){
    if(orgId !== 0){
      this.selectedOrganization = organizationCode;
    }else{
      this.selectedOrganization = "Select Organization";
    }
    this.param.organizationId = orgId;
  }


  Export(){
    console.log("Exporting data");

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false
    };
    
    new Angular2Csv(this.rowData,'EOI Detail Report',options);
  }
}

export class QueryParameter{
  period1: number;
  period2: number;
  organizationId: number;

  constructor(){
    this.organizationId = 0;
    this.period1 = 0;
    this.period2 = 0;
  }

}
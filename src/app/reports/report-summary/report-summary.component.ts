import { 
  Component, 
  OnInit,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import { CommonService } from '../common.service';
import { ReportsService } from '../reports.service';
import { Organization } from '../models/Organization';
import { GridOptions } from 'ag-grid/main';
import { Angular2Csv  } from '../_helpers/angular2-csv';
import { Subscription } from 'rxjs';

@Component({
  selector: 'eo-report-summary',
  template:require('./report-summary.component.html'),
  animations:[
    trigger('chartDiv',[
      state('in', style({
        opacity:1,
        transform: 'translateX(0)'
      })),
      transition('void=>*',[
        style({
          opacity: 0,
          transform: 'translateX(-200px)'
        }),
        animate(600)
      ]),
      transition('* => void',[
        animate(600, style({
          transform: 'translateX(200px)',
          opacity: 0
        }))
      ])
    ]),
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
export class ReportSummaryComponent implements OnInit{ 
  busy: Subscription;
  private organizations: Organization[] = [];
  private selectedOrganization: string = "Select Organization";
  private rowData: any[];
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowCount:string;

  // data chart
  public isShowChart: boolean = false;
  chart1Options: Object;
  //chart2Options: Object;
  private chart1Data: any[] = [];
  //private chart2Data: any[] = [];

  constructor(private itemService: ReportsService
              ,private commonService: CommonService){
    this.gridOptions = <GridOptions>{};
    this.gridOptions.rowData = this.rowData;
    this.gridOptions.columnDefs = this.createColumnDefs();
    this.showGrid = false;

    this.chart1Options = {title:{text: ''}};
    //this.chart2Options = {title:{text: ''}};
  }

   ngOnInit(){
     this.loadOrganizations();
  }

  public LoadReport(orgId:number){
    this.createRowData(orgId);
    this.showGrid = true;
  }

  private createColumnDefs() {
    return [
      {headerName: 'Period', field: 'period', width: 100, pinned: true},
      {
        headerName: 'Excess D Inv $', 
        field: 'total_Excess_D_Inv_Cost', 
        width:140,
        cellRenderer: this.actualCurrencyCellRenderer
      },
      {
        headerName: 'Excess D On Order $', 
        field: 'total_Excess_On_Order_Cost', 
        width:180,
        cellRenderer: this.actualCurrencyCellRenderer
      },
      {
        headerName: 'Excess D Inv $ with no Annual Usage', 
        field: 'total_Excess_D_Inv_Cost_No_Annual_Usage', 
        width:280,
        cellRenderer: this.actualCurrencyCellRenderer
    },
      {
        headerName: 'Excess D On Order $ with no Annual Usage', 
        field: 'total_Excess_D_On_Order_Cost_No_Annual_Usage', 
        width:320,
        cellRenderer: this.actualCurrencyCellRenderer
      },
      {
        headerName: 'Excess On Order $ exclude D Use', 
        field: 'total_Excess_On_Order_Cost_Exclude_D_Use', 
        width:280,
        cellRenderer: this.actualCurrencyCellRenderer
      },
      {
        headerName: 'Excess D Inv $ exclude D Use', 
        field: 'total_Excess_D_Inv_Cost_Exclude_D_Use', 
        width:220,
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

  public createRowData(orgId: number){
    this.busy = this.itemService.getSummaryReport(orgId).subscribe(
      (data:any) => {
        this.rowData = data;
        //console.log(this.rowData);
        this.createChartData(this.rowData);
      }
    );
  }
  
  public createChartData(data:any[]){

    //const dInventoryCosts = [];
    const exDInventoryCosts = []; 
    const exDOnOrderCosts = [];
    const exDInvCostNoAnnualUsage = [];
    //const PercentDUnsold = [];
    //const exDOnOrderNoAnnualUsage = []; 
    //const exOnOrderCostExcludeDUse = [];
    //const exDInvCostExcludeDUse = [];
    //var percent;
    for(let key in data){
      //dInventoryCosts.push(data[key].total_D_Inv_Cost);
      exDInventoryCosts.push(data[key].total_Excess_D_Inv_Cost);
      exDOnOrderCosts.push(data[key].total_Excess_On_Order_Cost);
      exDInvCostNoAnnualUsage.push(data[key].total_Excess_D_Inv_Cost_No_Annual_Usage);
      // percent = +((data[key].total_Excess_D_Inv_Cost/data[key].total_D_Inv_Cost).toFixed(2));
      // PercentDUnsold.push(percent);
      //exDOnOrderNoAnnualUsage.push(data[key].total_Excess_D_On_Order_Cost_No_Annual_Usage);
      //exOnOrderCostExcludeDUse.push(data[key].total_Excess_On_Order_Cost_Exclude_D_Use);
      //exDInvCostExcludeDUse.push(data[key].total_Excess_D_Inv_Cost_Exclude_D_Use);
    }

    this.chart1Data = [
          //{name:'D Inventory $', data: dInventoryCosts},
          {name:'Excess D Inventory $', data: exDInventoryCosts},
          {name:'Excess D On Order $', data: exDOnOrderCosts},
          {name:'Excess D Inv $ No Annual Usage', data: exDInvCostNoAnnualUsage},
          //{name:'Excess D On Order $ No Annual Usage', data: exDOnOrderNoAnnualUsage},
          //{name:'Excess On Order $ Exclude D Use', data: exOnOrderCostExcludeDUse},
          //{name:'Excess D Inv $ Exclude D Use', data: exDInvCostExcludeDUse},
    ];
    
    this.chart1Options = {
        title : { text : 'Excess & Obsolete Report by Period' },
        credits: { enabled: false},
        series: this.chart1Data
    };

    //   this.chart2Data = [
    //     {name:'Percent D Unsold to Total D', data: PercentDUnsold},
    // ];
    
    // this.chart2Options = {
    //     title : { text : 'Percent D Unsold to Total D' },
    //     credits: { enabled: false},
    //     series: this.chart2Data
    // };

  }

  private showHideChart(){
    if(this.isShowChart){
      this.isShowChart = false;
    }else{
      this.isShowChart = true;
    }
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

  loadOrganizations(){
     this.commonService.loadOrganizations()
     .subscribe((data: Organization[]) => this.organizations = data);
  }

  public onOrganizationChange(orgId:number, organizationCode: string){
    if(orgId !== 0){
      this.selectedOrganization = organizationCode;
    }else{
      this.selectedOrganization = "Select Organization";
      this.showGrid = false;
      this.isShowChart = false;
    }
    //console.log(orgId);
    this.LoadReport(orgId);
  }

  Export(){

     console.log("Exporting data");

     var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'EOI Summary Report'
    };

     new Angular2Csv(this.rowData,'EOI Summary Report',options);

  }
}


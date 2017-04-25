import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { HeaderComponent } from './navmenu/header.component';

import { NewHeaderComponent } from './navmenu/header-new.component';

import { FooterComponent } from './footer/footer.component';
import { NewFooterComponent } from './footer/footer-new.component';

import { ReportDetailComponent } from './reports/report-detail/report-detail.component';
import { ReportExportComponent } from './reports/report-export/report-export.component';
import { ReportSummaryComponent } from './reports/report-summary/report-summary.component';
import { TableDemoComponent } from './reports/demo/table-demo.component';

import { ReportsService } from './reports/reports.service';
import { CommonService } from './reports/common.service';
import { Logger } from './logger.service';
import EoiErrorHandler from './error-handler';

import {AgGridModule} from "ag-grid-ng2/main";
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ng2-bootstrap/pagination';
import { DropdownModule } from 'ng2-bootstrap/dropdown';
import { TabsModule } from 'ng2-bootstrap';
import { ChartModule } from 'angular2-highcharts';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import {BusyModule} from 'angular2-busy';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NewHeaderComponent,
    FooterComponent,
    NewFooterComponent,
    ReportDetailComponent,
    ReportExportComponent,
    ReportSummaryComponent,
    TableDemoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    Ng2TableModule,
    PaginationModule.forRoot(),
    DropdownModule.forRoot(),
    TabsModule,
    CommonModule,
    AgGridModule.withComponents([]),
    ChartModule,
    JsonpModule,
    SlimLoadingBarModule.forRoot(),
    BusyModule
  ],
  providers:[
    Logger,
    ReportsService,
    CommonService,
    {provide: ErrorHandler,useClass: EoiErrorHandler }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }

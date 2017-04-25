import { Routes, RouterModule } from '@angular/router';

import { ReportDetailComponent } from './reports/report-detail/report-detail.component';
import { ReportExportComponent } from './reports/report-export/report-export.component';
import { ReportSummaryComponent } from './reports/report-summary/report-summary.component';
import { TableDemoComponent } from './reports/demo/table-demo.component';

const APP_ROUTES: Routes =[
    { path:'',redirectTo: 'summary', pathMatch: 'full'},
    { path:'summary',component:ReportSummaryComponent },
    { path:'detail',component:ReportDetailComponent },
    { path:'export',component:ReportExportComponent },
    // { path:'demo',component:TableDemoComponent },
    { path: '**', component: ReportSummaryComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);
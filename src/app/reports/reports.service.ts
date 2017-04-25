import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Logger } from '../logger.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { DetailReport } from './models/DetailReport';
import { SummaryReport } from './models/SummaryReport';
import { ExportReport } from './models/ExportReport';


@Injectable()

export class ReportsService{

    private apiUrl:string;
    private itemsUrl:string;
    private reportUrl: string;
    constructor(public http: Http, public logger: Logger) {}

    getSummaryReport(organizationId:number = 0){
        this.apiUrl = '';
        // this.apiUrl = 'http://usmtn-dssln13:8080/API/report/summary' + '/' + organizationId;
        //this.apiUrl = 'http://vlvswebservices-test/ExcessOrderInventoryAPI/API/report/summary' + '/' + organizationId;
        //this.apiUrl = 'http://vlvswebservices-stage/ExcessOrderInventoryAPI/API/report/summary' + '/' + organizationId;
        this.apiUrl = 'http://vlvswebservices/ExcessOrderInventoryAPI/API/report/summary' + '/' + organizationId;

        return this.http.get(this.apiUrl)
                .map((response:Response) => response.json())
                .catch(this.handleError);
    }

    getDetailReport(organizationId:number = 0, period1:number = 0, period2:number = 0): Observable<DetailReport[]>{
        this.reportUrl = '';
        // this.reportUrl = 'http://usmtn-dssln13:8080/API/report/detail/' + organizationId + '/' + period1 + '/' + period2;
        //this.reportUrl = 'http://vlvswebservices-test/ExcessOrderInventoryAPI/API/report/detail/' + organizationId + '/' + period1 + '/' + period2;
        //this.reportUrl = 'http://vlvswebservices-stage/ExcessOrderInventoryAPI/API/report/detail/' + organizationId + '/' + period1 + '/' + period2;
        this.reportUrl = 'http://vlvswebservices/ExcessOrderInventoryAPI/API/report/detail/' + organizationId + '/' + period1 + '/' + period2;
        return this.http.get(this.reportUrl)
                .map((response:Response) => <DetailReport[]>response.json())
                .catch(this.handleError);
    }

    getExportReport(period:number = 0, organizationId:number = 0): Observable<ExportReport[]>{
        this.itemsUrl = '';
        // this.itemsUrl = 'http://usmtn-dssln13:8080/API/report/export' + '/' + period + '/' + organizationId;
        // this.itemsUrl = 'http://vlvswebservices-test/ExcessOrderInventoryAPI/API/report/export' + '/' + period + '/' + organizationId;
        // this.itemsUrl = 'http://vlvswebservices-stage/ExcessOrderInventoryAPI/API/report/export' + '/' + period + '/' + organizationId;
        this.itemsUrl = 'http://vlvswebservices/ExcessOrderInventoryAPI/API/report/export' + '/' + period + '/' + organizationId;
        return this.http.get(this.itemsUrl)
                .map((response:Response) => response.json() as ExportReport[])
                .catch(this.handleError);
    }

    private handleError(error: any): Promise<any>{
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }
}
import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Logger } from '../logger.service';
import 'rxjs/Rx';
import { Organization } from './models/Organization';
import { Period } from './models/Period';

@Injectable()

export class CommonService implements OnInit {

    // private loadOrganizationUrl = 'http://usmtn-dssln13:8080/API/values/organizations';
    // private loadWeeklyPeriodsUrl = 'http://usmtn-dssln13:8080/API/values/periods';

    // private loadOrganizationUrl = 'http://vlvswebservices-test/ExcessOrderInventoryAPI/API/values/organizations';
    // private loadWeeklyPeriodsUrl = 'http://vlvswebservices-test/ExcessOrderInventoryAPI/API/values/periods';

    // private loadOrganizationUrl = 'http://vlvswebservices-stage/ExcessOrderInventoryAPI/api/values/organizations';
    // private loadWeeklyPeriodsUrl = 'http://vlvswebservices-stage/ExcessOrderInventoryAPI/api/values/periods';

    private loadOrganizationUrl = 'http://vlvswebservices/ExcessOrderInventoryAPI/api/values/organizations';
    private loadWeeklyPeriodsUrl = 'http://vlvswebservices/ExcessOrderInventoryAPI/api/values/periods';

    constructor(public http:Http, public logger: Logger){}

    ngOnInit(){
        this.loadOrganizations();
        this.loadWeeklyPeriods();
    }

    loadOrganizations(){
        console.log("loading organizations from database");
        return this.http.get(this.loadOrganizationUrl)
            .map((response: Response) => <Organization[]>response.json())
            .catch(this.handleError)
    }

    loadWeeklyPeriods(){
        console.log("loading periods from database");
        return this.http.get(this.loadWeeklyPeriodsUrl)
            .map((response: Response) => <Period[]>response.json())
            .catch(this.handleError)
    }

    private handleError(error: any): Promise<any>{
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }
}
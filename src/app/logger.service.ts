import { Injectable } from '@angular/core';

@Injectable()

export class Logger{
    private logs: string[] = [];

    log(message: string){
        this.logs.push(message);
        console.log(message);
    }
}
import { ErrorHandler } from '@angular/core';

export default class EoiErrorHandler implements ErrorHandler{
    handleError(error){
        console.log(error);
    }
}
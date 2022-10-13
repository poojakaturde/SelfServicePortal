import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../services/loader-service/loader.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(private loaderService: LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let token = localStorage.getItem('token');
        if (token) {
            this.loaderService.isLoading.next(true);
            request = request.clone({
                headers: request.headers.set('Authorization', '' + token),

            });
        }

        return next.handle(request).pipe(finalize(
            () => {
                this.loaderService.isLoading.next(false);
            }
        ))

    }
}
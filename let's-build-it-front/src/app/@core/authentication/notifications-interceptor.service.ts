import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, } from 'rxjs/operators';
import { NotificationsService } from '../../@ideo/components/notifications/notifications.service';
import { ErrorMessages } from '../../@shared/models/error-messages.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsInterceptorService implements HttpInterceptor {
  constructor(private _injector: Injector) { }



  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const _notificationService = this._injector.get(NotificationsService);
    if (req?.params.get('autoNotification') === 'true') {
      return next.handle(req).pipe(
        tap(res => {
          if (res.type !== 0) { // TODO fix res return {type = 0} 
            let message = req?.params?.get(200?.toString())
            let entity = req?.params?.get('entity')
            _notificationService
              .handleError(res as HttpErrorResponse, entity, { [200]: message })
          }
          return res
        }),
        catchError((err: HttpEvent<any>) => {
          if (err instanceof HttpErrorResponse) {
            let message = req?.params?.get(err.status?.toString())
            let entity = req?.params?.get('entity')
            _notificationService
              .handleError(err as HttpErrorResponse, entity, { [err.status]: message } as ErrorMessages)
          }
          return of(err)
        })
      )
    }
    else {
      return next.handle(req)
    }
  }
}

import { HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ErrorMessages } from '../../../@shared/models/error-messages.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor() { }

  private addNotification: Subject<Notification> = new Subject<Notification>();

  public onNotificationEvent(): Observable<any> {
    return this.addNotification.asObservable();
  }

  public error(content: string, title: string = 'Error', duration: number = 5 * 1000) {
    this.addNotification.next({
      content,
      title,
      type: 'error',
    });
  }

  public warning(content: string, title: string = 'Warning', duration: number = 5 * 1000) {
    this.addNotification.next({
      content,
      title,
      type: 'warning',
    });
  }

  public success(content: string, title: string = 'Success', duration: number = 5 * 1000) {
    this.addNotification.next({
      content,
      title,
      type: 'success',
    });
  }

  public handleError(err: HttpErrorResponse | HttpResponse<any>, entityName?: string, messageObj?: ErrorMessages) {
    entityName = entityName || ''
    let message
    switch (err?.status) {
      case 200:
        // Success
        message = messageObj?.[err?.status] || (entityName + " Update successfully")
        if (message !== "false") {
          this.success(message);
        }
        break;
      case 204:
        // No Content
        message = messageObj?.[err?.status] || ` No Content of ${entityName} Found`
        if (message !== "false") {
          this.error(message);
        }
        break;
      case 400:
        // "Validation Error
        message = messageObj?.[err?.status] || "Validation Error"
        if (message !== "false") {
          this.warning(message);
        }
        break;
      case 403:
        // Forboded
        message = messageObj?.[err?.status] || "Forboded no Permissions for this ole"
        if (message !== "false") {
          this.warning(message);
        }
        break;
      case 404:
        // Resource not found 
        message = messageObj?.[err?.status] || entityName + ' Not Found'
        if (message !== "false") {
          this.error(message);
        }
        break;
      case 500:
        // bed url 
        // coronation id
        message = messageObj?.[err?.status] || "Bed Url Request"
        if (message !== "false") {
          this.error(message);
        }
        break;
      default:
        break;
    }
  }

  public info(content: string, title: string = 'Info', duration: number = 5 * 1000) {
    this.addNotification.next({
      content,
      title,
      type: 'info',
    });
  }

  public notify(type: NotificationType, message: string, duration: number = 5 * 1000) {
    switch (type) {
      case 'error':
        this.error(message, null, duration);
        break;
      case 'info':
        this.info(message, null, duration);
        break;
      case 'success':
        this.success(message, null, duration);
        break;
      case 'warning':
        this.warning(message, null, duration);
        break;
      default:
        break;
    }
  }
}

export type NotificationType = 'error' | 'info' | 'warning' | 'success';
export interface Notification {
  type: NotificationType;
  title: string;
  content: string;
  duration?: number;
}

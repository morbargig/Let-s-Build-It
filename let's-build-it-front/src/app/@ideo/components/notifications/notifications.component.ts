import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { Notification } from './notifications.service';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'ideo-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  constructor(private notificationsService: NotificationsService) {}

  private isAlive: boolean;
  public notifications: Notification[] = [];

  ngOnInit() {
    this.isAlive = true;
    this.notificationsService
      .onNotificationEvent()
      .pipe(takeWhile((x) => this.isAlive))
      .subscribe((notification) => {
        this.notifications.push(notification);
        setTimeout(() => {
          this.notifications.splice(this.notifications.indexOf(notification), 1);
        }, notification?.duration || 10 * 1000);
      });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  public close(evt: Notification) {
    this.notifications.splice(this.notifications.indexOf(evt), 1);
  }
}

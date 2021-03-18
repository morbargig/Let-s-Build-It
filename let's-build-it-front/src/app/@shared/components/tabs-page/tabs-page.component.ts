import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { TabsPageConfig } from './tabs-page.config';

@Component({
  selector: 'prx-tabs-page',
  templateUrl: './tabs-page.component.html',
  styleUrls: ['./tabs-page.component.scss']
})
export class TabsPageComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private route: ActivatedRoute) {
    if (!!route.snapshot.data && !!route.snapshot.data.config) {
      this.config = route.snapshot.data.config;
    }


  }

  private endded: EventEmitter<boolean> = new EventEmitter<boolean>();
  public currentRoute: string = null;
  public config: TabsPageConfig;

  ngOnInit(): void {
    let urls = this.router.url?.split('/');
    if (!!urls?.length) {
      this.currentRoute = urls?.[(urls?.length - 1) || 0];
    }

    this.router.events
      .pipe(
        takeUntil(this.endded),
        filter((p) => p instanceof NavigationEnd)
      )
      .subscribe((res: NavigationEnd) => {
        let urls = res.url?.split('/');
        if (!!urls?.length) {
          this.currentRoute = urls?.[(urls?.length - 1) || 0];
          if (!this.config.tabs.find(t => t.value == this.currentRoute)) {
            this.currentRoute = this.config.tabs?.[0]?.value;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.endded.next(true);
  }

}

import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Params } from '@angular/router';
import { filter, take, takeUntil } from 'rxjs/operators';
import { SelectItem } from '../../../@ideo/components/table/models/select-item';
import { Observable, config } from 'rxjs';
import { BreadcrumType } from '../../../blocks/navigations/breadcrum/breadcrum.component';
import { SideBarConfig } from './sidebar.config';
import { SideBarPageService } from './isidibar-service.interface';
import { CarModel } from '../../models/car.model';
import { EntityDetailsModel } from './entity-details/entity-details.component';

@Component({
  selector: 'prx-side-bar-page',
  templateUrl: './side-bar-page.component.html',
  styleUrls: ['./side-bar-page.component.scss'],
})
export class SideBarPageComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private router: Router, private sidebarPageService: SideBarPageService) {
    this.loading = true;
    this.route.data.pipe(takeUntil(this.endded)).subscribe(async (data) => {
      let config: SideBarConfig<any> = data.config;
      this.backLink = config.backLink;
      this.sidebarItems = config.sidebarItems;
      this.sidebarPageService.breadcrumbs = config.breadcrumbs;
      this.getEntityById = config.getEntityById;
      this.showDetails = !route.snapshot.data['hideDetails'];

      this.route.params.pipe(takeUntil(this.endded)).subscribe((params) => {
        return this.getEntityById(params['id'], params)
          .toPromise()
          .then((entity) => {
            this.entity = entity;
            if (!!config.getEntityDetails) {
              this.entityDetails = config.getEntityDetails(this.entity);
            }
          })
          .finally(() => (this.loading = false));
      });
    });

    router.events
      .pipe(
        takeUntil(this.endded),
        filter((p) => p instanceof NavigationEnd)
      )
      .subscribe((res: NavigationEnd) => {
        let urls = res.url?.split('/');
        if (!!urls?.length) {
          let urlIndex = urls.length > 4 ? 4 : urls.length - 1;
          this.currentRoute = urls[urlIndex];
          this.sidebarPageService.setDetailsVisibility(true);
        }
      });
  }

  private endded: EventEmitter<boolean> = new EventEmitter<boolean>();
  public loading: boolean = false;
  public sidebarItems: SelectItem[];
  public backLink: SelectItem;
  public currentRoute: string;
  public getEntityById: (id: any, params?: Params) => Observable<any>;
  public entityDetails: EntityDetailsModel;

  public get breadcrumbs(): BreadcrumType[] {
    return this.sidebarPageService.breadcrumbs;
  }

  public get entity(): CarModel {
    return this.sidebarPageService.entity;
  }

  public set entity(v: CarModel) {
    this.sidebarPageService.entity = v;
  }

  public get showDetails(): boolean {
    return this.sidebarPageService.detailsVisible;
  }

  public set showDetails(v: boolean) {
    this.sidebarPageService.detailsVisible = v;
  }

  ngOnInit(): void {
    let urls = this.router.url?.split('/');
    if (!!urls?.length) {
      let urlIndex = urls.length > 4 ? 4 : urls.length - 1;
      this.currentRoute = urls[urlIndex];
    }
  }

  ngOnDestroy(): void {
    this.endded.emit(true);
  }
}

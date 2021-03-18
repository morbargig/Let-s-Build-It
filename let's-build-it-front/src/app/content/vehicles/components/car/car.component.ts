import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { CarModel } from '@app/@shared/models/car.model';
import { BreadcrumType } from '@app/blocks/navigations/breadcrum/breadcrum.component';
import { take, filter, takeWhile } from 'rxjs/operators';
import { CarsService } from '../../services/cars.service';
import { CarProfileService } from './car-profile.service';

@Component({
  selector: 'prx-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})
export class CarComponent implements OnInit, OnDestroy {
  private isActive: boolean = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private carsService: CarsService,
    private carProfile: CarProfileService
  ) {
    router.events
      .pipe(
        takeWhile((x) => !!this.isActive),
        filter((p) => p instanceof NavigationEnd)
      )
      .subscribe((res: NavigationEnd) => {
        let urls = res.url?.split('/');
        if (!!urls?.length) {
          this.currentRoute = urls[urls.length - 1];
        }
      });

    this.route.params.pipe(take(1)).subscribe((params) =>
      this.carsService
        .get(params['id'])
        .toPromise()
        .then((car) => {
          this.car = car;
        })
    );
  }
  ngOnDestroy(): void {
    this.isActive = false;
  }

  public currentRoute: string;
  public get car(): CarModel {
    return this.carProfile.car;
  }
  public set car(car: CarModel) {
    this.carProfile.car = car;
  }
  public get breadcrumbs(): BreadcrumType[] {
    return this.carProfile.breadcrumbs;
  }
  public set breadcrumbs(v: BreadcrumType[]) {
    this.carProfile.breadcrumbs = v;
  }
  public items: SelectItem[] = [
    {
      label: 'Summary',
      value: 'summary',
      click: (e) => {
        this.router.navigate(['./summary'], { relativeTo: this.route });
      },
    },
    {
      label: 'General',
      value: 'general',
      click: (e) => {
        this.router.navigate(['./general'], {
          relativeTo: this.route,
        });
      },
    },
    {
      label: 'Remote Control',
      value: 'remote-control',
      click: (e) => {
        this.router.navigate(['./remote-control'], { relativeTo: this.route });
      },
    },
    {
      label: 'Settings',
      value: 'settings',
      click: (e) => {
        this.router.navigate(['./settings'], { relativeTo: this.route });
      },
    },
    {
      label: 'Damages',
      value: 'damages',
      click: (e) => {
        this.router.navigate(['./damages'], { relativeTo: this.route });
      },
    },
    {
      label: 'Accidents',
      value: 'accidents',
      click: (e) => {
        this.router.navigate(['./accidents'], { relativeTo: this.route });
      },
    },
    {
      label: 'Zones',
      value: 'zones',
      click: (e) => {
        this.router.navigate(['./zones'], { relativeTo: this.route });
      },
    },
    {
      label: 'Contracts',
      value: 'contracts',
      click: (e) => {
        this.router.navigate(['./contracts'], { relativeTo: this.route });
      },
    },
    {
      label: 'Alerts',
      value: 'alerts',
      click: (e) => {
        this.router.navigate(['./alerts'], { relativeTo: this.route });
      },
    },
  ];

  ngOnInit(): void {
    let urls = this.router.url?.split('/');
    if (!!urls?.length) {
      this.currentRoute = urls[urls.length - 1];
    }
  }
}

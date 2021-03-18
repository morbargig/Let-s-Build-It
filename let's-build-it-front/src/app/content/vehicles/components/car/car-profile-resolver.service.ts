import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { EntityDetailsModel } from '@app/@shared/components/side-bar-page/entity-details/entity-details.component';
import { Observable } from 'rxjs';
import { SideBarConfig } from '../../../../@shared/components/side-bar-page/sidebar.config';
import { CarModel } from '../../../../@shared/models/car.model';
import { CarsService } from '../../services/cars.service';
import { TransmissionType } from '../../../../@shared/interfaces/transmission-type.enum';
import { faDochub } from '@fortawesome/free-brands-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class CarProfileResolverService implements Resolve<SideBarConfig<CarModel>> {
  constructor(private carsService: CarsService, private router: Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): SideBarConfig<CarModel> | Observable<SideBarConfig<CarModel>> | Promise<SideBarConfig<CarModel>> {
    return {
      backLink: { label: 'Vehicle', value: '/vehicles' },
      breadcrumbs: [],
      getEntityById: (id) => this.carsService.get(id),
      getEntityDetails: (car: CarModel) => {
        return {
          mediaId: car.profileImgId,
          title: `${car.manufacturer} ${car.model} ${car.modelYear} | ${car.plateNo}`,
          titleSpan:'',
          rightValues: [
            { label: 'Connection level', value: null },
            { label: 'Doors state', value: null },
            { label: 'Engine state', value: null },
          ],
          bottomValues: [
            { label: 'Type', value: null },
            { label: 'Colour', value: null },
            { label: 'Seats', icon: 'fa fa-seat', value: car.seatsNo },
            { label: 'Doors', icon: 'fa fa-door', value: car.doorsNumber },
            { label: 'Transmission', icon: 'fa fa-transmission', value: TransmissionType[car.transmission] },
            { label: 'Status', value: null },
            { label: 'Mileage', value: car.kmAtInitiate },
            { label: 'Fuel', value: null },
            { label: 'Battery', value: null },
            { label: 'Doors state', value: null },
            { label: 'Engine state', value: null },
          ],
        } as EntityDetailsModel;
      },
      sidebarItems: [
        {
          label: 'Summary',
          value: 'summary',
          icon: 'summary', 
          // permission: {
          //   values: ["AccessAgencyVehicle"]
          // },
          permission: {values:["AccessAgencyVehicles"]},
        },
        {
          label: 'General',
          value: 'general',
          icon: 'general',
          // permission: {
          //   values: ["AccessAgencyVehicle"]
          // },
          permission: {values:["AccessAgencyVehicles"]},

        },
        {
          label: 'Remote Control',
          value: 'remote-control',
          icon: 'remote',
          // permission: {
          //   values: ["AccessAgencyVehicle"]
          // },
          permission: {values:["AccessCarActionsLog"]},

        },
        {
          label: 'Settings',
          value: 'settings',
          icon: 'settings',
          // permission: {
          //   values: ["AccessAgencyVehicle"]
          // },
          permission: {values:["AccessAgencyVehicles"]},

        },
        {
          label: 'Damages',
          value: 'damages',
          icon: 'damages',
          // permission: {
          //   values: ["AccessAgencyVehicle"]
          // },
          permission: {values:["AccessVehicleDamages"]},

        },
        {
          label: 'Accidents',
          value: 'accidents',
          icon: 'accidents',
          // permission: {
          //   values: ["AccessAgencyVehicle"]
          // },
          permission: {values:["AccessVehicleAccidents"]},

        },
        {
          label: 'Zones',
          value: 'zones',
          icon: 'zones',
          // permission: {
          //   values: ["AccessAgencyVehicle"]
          // },
          permission: {values:["AccessAgencyVehicles"]},

        },
        {
          label: 'Contracts',
          value: 'contracts',
          icon: 'contracts',
          // permission: {
          //   values: ["AccessAgencyVehicle"]
          // },
          permission: {values:["AccessAgencyVehicles"]},

        },
        {
          label: 'Alerts',
          value: 'alerts',
          icon: 'alerts',
          // permission: {
          //   values: ["AccessAgencyVehicle"]
          // },
          permission: {values:["AccessAgencyVehicles"]},

        },
      ],
    } as SideBarConfig<CarModel>;
  }
}

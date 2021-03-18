import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { TableColumn, TableColumnType } from '../../../@ideo/components/table/models/table-column';
import { CalendarFilterComponent } from '../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { MultiselectFilterComponent } from '../../../@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { NumericFilterComponent } from '../../../@ideo/components/table/table-filters/numeric-filter/numeric-filter.component';
import { TextFilterComponent } from '../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { AlertModel } from '../../../@shared/models/alert.model';
import { BasePageConfig } from '../../../@shared/models/base-page.config';
import { AlertsService } from './alerts.service';
import { AlertSubject } from '../../../@shared/interfaces/alert-subject.enum';
import { AlertStatus } from '../../../@shared/interfaces/alert-status.enum';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CarDamageModalComponent } from './components/car-damage-modal/car-damage-modal.component';
import { CarAccidentModalComponent } from './components/car-accident-modal/car-accident-modal.component';
import { TouristVisaModalComponent } from './components/tourist-visa-modal/tourist-visa-modal.component';
import { RentalForceCloseWithNoChargeModalComponent } from './components/rental-force-close-with-no-charge-modal/rental-force-close-with-no-charge-modal.component';
import { RentalForceCloseModalComponent } from './components/rental-force-close-modal/rental-force-close-modal.component';
import { map, take, filter } from 'rxjs/operators';
import { ComponentDataStore } from '../../../@shared/models/components-data-store';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { UtilsService } from '@app/@core/services/utils.service';
import { AlertFormService } from '../alerts/alert-form.service';
import { ImportConfig } from '@app/@shared/models/import.config';
import { BehaviorSubject, EMPTY, Subject } from 'rxjs';
import { AlertSubjectStatus } from '@app/@shared/interfaces/alert-subject-status.enum';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { UsersService } from '../../users/services/users.service';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { CarsService } from '../../vehicles/services/cars.service';

@Injectable({
  providedIn: 'root',
})
export class AlertsResolverService implements Resolve<BasePageConfig<any>> {
  constructor(
    private alertsService: AlertsService,
    private utilsService: UtilsService,
    private modalService: BsModalService,
    private notificationsService: NotificationsService,
    private alertFormService: AlertFormService,
    private usersService: UsersService,
    private carsService: CarsService
  ) {}

  private users$: BehaviorSubject<SelectItem[]>;
  private cars$: BehaviorSubject<SelectItem[]>;
  private dataStore: ComponentDataStore<AlertModel>;

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<BasePageConfig<AlertModel>> {
    let users = await this.usersService
      .getAll({
        page: 1,
        pageSize: 200,
      } as LazyLoadEvent)
      .pipe(
        map((r) =>
          r?.data?.map((a) => {
            return {
              value: a.id,
              label: a.userName,
            } as SelectItem;
          })
        )
      )
      .toPromise();
    if (!!this.users$) {
      this.users$.next(users);
    } else {
      this.users$ = new BehaviorSubject<SelectItem[]>(users);
    }

    let cars = await this.carsService
      .getAll({
        page: 1,
        pageSize: 200,
      } as LazyLoadEvent)
      .pipe(
        map((r) =>
          r?.data?.map((a) => {
            return {
              value: a.id,
              label: a.plateNo,
            } as SelectItem;
          })
        )
      )
      .toPromise();
    if (!!this.cars$) {
      this.cars$.next(cars);
    } else {
      this.cars$ = new BehaviorSubject<SelectItem[]>(cars);
    }

    const columns: TableColumn[] = [
      {
        field: 'subject',
        header: 'Subject',
        sortable: true,
        parsedData: (val) => {
          return !!val ? AlertSubject[val] : '';
        },
        filter: [
          {
            name: 'Subject',
            type: MultiselectFilterComponent,
            options: this.utilsService.toSelectItem(AlertSubject),
          },
        ],
      },
      {
        field: 'subjectStatus',
        header: 'Subject Status',
        sortable: true,
        hidden: true,
        // parsedData: (val) => {
        //   return !!val ? AlertSubjectStatus[val] : '';
        // },
        filter: [
          {
            name: 'SubjectStatus',
            type: MultiselectFilterComponent,
            options: this.utilsService.toSelectItem(AlertSubjectStatus),
          },
        ],
      },
      {
        field: 'userId',
        header: 'User',
        parsedData: (val) => {
          return users.find((u) => u.value == val)?.label;
        },
        sortable: true,
        filter: [
          {
            name: 'UserId',
            type: MultiselectFilterComponent,
            placeholder: 'User',
            asyncOptions: this.users$,
          },
        ],
      },
      {
        field: 'orderId',
        header: 'Order Id',
        sortable: true,
        filter: [{ name: 'OrderId', type: NumericFilterComponent, placeholder: 'Order Id' }],
      },
      {
        field: 'carId',
        header: 'Car Plate',
        parsedData: (val) => {
          return cars.find((u) => u.value == val)?.label;
        },
        sortable: true,
        filter: [
          {
            name: 'CarId',
            type: MultiselectFilterComponent,
            placeholder: 'Car Plate',
            asyncOptions: this.cars$,
          },
        ],
      },
      {
        field: 'status',
        header: 'Status',
        sortable: true,
        parsedData: (val) => {
          return !!val ? AlertStatus[val] : '';
        },
        filter: [
          {
            name: 'Status',
            type: MultiselectFilterComponent,
            options: this.utilsService.toSelectItem(AlertStatus),
          },
        ],
      },
      {
        field: 'comment',
        header: 'Comment',
        // sortable: true,
        hidden: true,
        filter: [],
        // filter: [{ name: 'Comment', type: TextFilterComponent, placeholder: 'Comment' }],
      },
      {
        field: 'createUserId',
        header: 'Create User',
        sortable: true,
        hidden: true,
        filter: [
          {
            name: 'UserId',
            type: MultiselectFilterComponent,
            placeholder: 'Create User',
            asyncOptions: this.users$,
          },
        ],
      },
      {
        field: 'updateUserId',
        header: 'Update User',
        sortable: true,
        hidden: true,
        filter: [
          {
            name: 'UserId',
            type: MultiselectFilterComponent,
            placeholder: 'Update User',
            asyncOptions: this.users$,
          },
        ],
      },
      {
        field: 'created',
        header: 'Created',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'Created', type: CalendarFilterComponent, placeholder: 'Created' }],
      },
      {
        field: 'updated',
        header: 'Updated',
        sortable: true,
        type: TableColumnType.DateTime,
        filter: [{ name: 'Updated', type: CalendarFilterComponent, placeholder: 'Updated' }],
      },
      {
        field: 'id',
        hidden: true,
        filter: [],
      },
    ];
    const formControls = this.alertFormService.generate();
    return new BasePageConfig({
      columns: columns,
      deleteEntity: (evt) => EMPTY,
      getDataProvider: (evt) => this.alertsService.getAll(evt),
      registerDataStore: (ds) => (this.dataStore = ds),
      showCreateButton: false,
      formRoute: 'users',
      title: 'Alerts',
      preTitle: 'Fleet',
      itemActions: [
        {
          icon: 'fas fa-dumpster-fire',
          hidden: (item) => !item.subject || item.subject != AlertSubject.CarDamage,
          click: (item, btn) => {
            const carDamageModal = this.modalService.show(CarDamageModalComponent, {
              initialState: { alert: item },
              class: 'modal-xl modal-dialog-centered',
            });
            (<CarDamageModalComponent>carDamageModal.content).onClose.pipe(take(1)).subscribe((submitted) => {
              if (!!submitted) {
                this.notificationsService.success('Status updated successfully.');
                this.dataStore.refreshData();
              }
            });
          },
        },
        {
          icon: 'fas fa-car-crash',
          hidden: (item) => !item.subject || item.subject != AlertSubject.CarAccident,
          click: (item, btn) => {
            const carAccidentModal = this.modalService.show(CarAccidentModalComponent, {
              initialState: { alert: item },
              class: 'modal-xl modal-dialog-centered',
            });
            (<CarAccidentModalComponent>carAccidentModal.content).onClose.pipe(take(1)).subscribe((submitted) => {
              if (!!submitted) {
                this.notificationsService.success('Status updated successfully.');
                this.dataStore.refreshData();
              }
            });
          },
        },
        {
          icon: 'fas fa-passport',
          hidden: (item) => !item.subject || item.subject != AlertSubject.TouristVisa,
          click: (item, btn) => {
            const touristVisaModal = this.modalService.show(TouristVisaModalComponent, {
              initialState: { alert: item },
              class: 'modal-xl modal-dialog-centered',
            });
            (<TouristVisaModalComponent>touristVisaModal.content).onClose.pipe(take(1)).subscribe((submitted) => {
              if (!!submitted) {
                this.notificationsService.success('Status updated successfully.');
                this.dataStore.refreshData();
              }
            });
          },
        },
        {
          icon: 'fas fa-cash-register',
          hidden: (item) => !item.subject || item.subject != AlertSubject.RentalForceCloseWithNoCharge,
          click: (item, btn) => {
            const rentalForceCloseWithNoChargeModal = this.modalService.show(
              RentalForceCloseWithNoChargeModalComponent,
              {
                initialState: { alert: item },
                class: 'modal-xl modal-dialog-centered',
              }
            );
            (<RentalForceCloseWithNoChargeModalComponent>rentalForceCloseWithNoChargeModal.content).onClose
              .pipe(take(1))
              .subscribe((submitted) => {
                if (!!submitted) {
                  this.notificationsService.success('Status updated successfully.');
                  this.dataStore.refreshData();
                }
              });
          },
        },
        {
          icon: 'fas fa-door-closed',
          hidden: (item) => !item.subject || item.subject != AlertSubject.RentalForceClose,
          click: (item, btn) => {
            const rentalForceCloseModal = this.modalService.show(RentalForceCloseModalComponent, {
              initialState: { alert: item },
              class: 'modal-xl modal-dialog-centered',
            });
            (<RentalForceCloseModalComponent>rentalForceCloseModal.content).onClose
              .pipe(take(1))
              .subscribe((submitted) => {
                if (!!submitted) {
                  this.notificationsService.success('Status updated successfully.');
                  this.dataStore.refreshData();
                }
              });
          },
        },
      ],
      importConfig: new ImportConfig({
        downloadTemplate: 'api/alerts/template',
        parseDataUrl: () => null,
        import: (model: AlertModel[]) => this.alertsService.bulk(model),
        columns: columns,
        controls: formControls,
      }),
      permissions: {},
      stateKey: 'alerts-table',
    });
  }
}

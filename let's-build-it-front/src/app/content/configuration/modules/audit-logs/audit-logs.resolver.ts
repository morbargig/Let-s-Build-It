import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { throwError } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SelectItem } from '../../../../@forms/@core/interfaces';
import { TableColumnType } from '../../../../@ideo/components/table/models/table-column';
import { MatchMode } from '../../../../@ideo/components/table/models/table-filter';
import { CalendarFilterComponent } from '../../../../@ideo/components/table/table-filters/calendar-filter/calendar-filter.component';
import { RelatedFilterComponent } from '../../../../@ideo/components/table/table-filters/related-filter/related-filter.component';
import { SelectFilterComponent } from '../../../../@ideo/components/table/table-filters/select-filter/select-filter.component';
import { TextFilterComponent } from '../../../../@ideo/components/table/table-filters/text-filter/text-filter.component';
import { BasePageConfig } from '../../../../@shared/models/base-page.config';
import { AuditLogModel } from './models/audiit-log';
import { AuditLogsService } from './services/audit-logs.service';
import { MultiselectFilterComponent } from '../../../../@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AuditLogDetailsModalComponent } from './components/audit-log-details-modal/audit-log-details-modal.component';
import { FilterObject } from '../../../../@ideo/components/table/events/lazy-load.event';

@Injectable({
  providedIn: 'root',
})
export class AuditLogsResolverService implements Resolve<BasePageConfig<any>> {
  constructor(private auditLogsService: AuditLogsService, private modalService: BsModalService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<AuditLogModel> {
    return new BasePageConfig({
      columns: [
        {
          field: 'entityType',
          header: 'Entity type',
          sortable: true,
          filter: [
            {
              name: 'Id',
              type: MultiselectFilterComponent,
              placeholder: 'Entity',
              queryFilters: (query) => {
                return {
                  "NewValues": {
                    value: query,
                    matchMode: MatchMode.Contains,
                  }
                } as FilterObject
              },
              lazyOptions: (evt) => {
                evt.sortColumn = 'Created';
                evt.sortDirection = 'desc';
                return this.auditLogsService
                  .getAll(evt)
                  .pipe(
                    map((z) => {
                      let val = {
                        data: z.data.map((x) => {
                          return {
                            label: `${x.entityType} (id: ${x.id})`,
                            value: x.id,
                          } as SelectItem;
                        }),
                        total: z.total
                      };
                      return val;
                    })
                  )
              },
            }
          ]
        },
        {
          field: 'entityType',
          header: 'Entity type',
          sortable: true,
          filter: [
            {
              name: 'EntityType',
              type: MultiselectFilterComponent,
              placeholder: 'Entity type',
              // lazyOptions: (evt) => {
              //   evt.sortColumn = 'EntityType';
              //   evt.sortDirection = 'asc';
              //   return this.auditLogsService
              //   .getEntityTypes(evt)
              //   .pipe(
              //     map((z) =>
              //       z.data.map((x) => {
              //         return {
              //           label: x,
              //           value: x,
              //         } as SelectItem;
              //       })
              //     )
              //   )
              // },
              asyncOptions: this.auditLogsService
                .getEntityTypes({ page: 1, sortColumn: 'EntityType', sortDirection: 'asc' })
                .pipe(
                  map((z) =>
                    z.data.map((x) => {
                      return {
                        label: x,
                        value: x,
                      } as SelectItem;
                    })
                  )
                ),
            },
          ],
        },
        {
          field: 'action',
          header: 'Action',
          sortable: true,
          filter: [
            {
              name: 'Action',
              type: MultiselectFilterComponent,
              placeholder: 'Action',
              options: [
                { label: 'Create', value: 0 },
                { label: 'Delete', value: 1 },
                { label: 'Update', value: 2 },
              ],
            },
          ],
        },
        {
          field: 'userName',
          header: 'User',
          sortable: true,
          filter: [
            {
              name: 'User',
              type: TextFilterComponent,
              placeholder: 'User',
            },
          ],
        },
        {
          field: 'ip',
          header: 'IP',
          sortable: true,
          filter: [{ name: 'IP', type: TextFilterComponent, placeholder: 'IP' }],
        },
        { field: 'actionString', header: 'Description' },
        {
          field: 'created',
          header: 'Date',
          sortable: true,
          type: TableColumnType.DateTime,
          filter: [{ name: 'Created', type: CalendarFilterComponent, placeholder: 'Created' }],
        },
      ],
      deleteEntity: (carrier) => throwError({}),
      getDataProvider: (evt) => this.auditLogsService.getAll(evt),
      showDeleteButton: false,
      formRoute: 'audit-log',
      title: 'Audit Logs',
      controllerName: 'AuditLogs',
      stateKey: 'audit-logs-table',
      itemActions: [
        {
          styleClass: 'btn-outline-success ml-2',
          tooltip: 'View Change',
          icon: 'fas fa-info-circle',
          click: (item, btn) => {
            const auditLogDetails = this.modalService.show(AuditLogDetailsModalComponent, {
              initialState: item,
              class: 'modal-lg modal-dialog-centered',
            });
            (<AuditLogDetailsModalComponent>auditLogDetails.content).onClose.pipe(take(1)).subscribe((res) => { });
          },
        },
      ],
    });
  }
}

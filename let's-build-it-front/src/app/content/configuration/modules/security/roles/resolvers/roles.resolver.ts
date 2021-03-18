import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BasePageConfig } from '../../../../../../@shared/models/base-page.config';
import { RoleModel } from '../../../../../../@shared/models/role.model';
import { RolesService } from '../services/roles.service';
import { MultiselectFilterComponent } from '../../../../../../@ideo/components/table/table-filters/multiselect-filter/multiselect-filter.component';
import { MAX_INT } from '../../../../../../@ideo/components/table/table.component';
import { map, tap, take } from 'rxjs/operators';
import { SelectItem } from '../../../../../../@forms/@core/interfaces';
import { CheckboxFilterComponent } from '../../../../../../@ideo/components/table/table-filters/checkbox-filter/checkbox-filter.component';
import { throwError, Subject, Observable } from 'rxjs';
import { TableColumnType } from '../../../../../../@ideo/components/table/models/table-column';
import { BooleanFilterComponent } from '@app/@ideo/components/table/table-filters/boolean-filter/boolean-filter.component';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { LazyLoadEvent } from '../../../../../../@ideo/components/table/events/lazy-load.event';

@Injectable({
  providedIn: 'root',
})
export class RolesResolverService implements Resolve<BasePageConfig<any>> {
  constructor(private rolesService: RolesService, private router: Router) { }

  private roles: SelectItem[] = [];

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BasePageConfig<RoleModel> {

    const rolesEmitter: Subject<IPagedList<SelectItem>> = new Subject<IPagedList<SelectItem>>();
    const rolesAction: (evt: LazyLoadEvent) => Observable<IPagedList<SelectItem>> = (evt) => {
      evt.sortColumn = 'Name';
      evt.sortDirection = 'asc';

      return this.rolesService
        .getAll(evt)
        .pipe(
          map((z) => {
            let val = {
              data: z.data.map((x) => {
                return {
                  label: x.name,
                  value: x.id,
                } as SelectItem;
              }),
              total: z.total
            };
            return val;
          }),
          take(1))
    };

    return new BasePageConfig({
      columns: [
        {
          field: 'name',
          header: 'Name',
          sortable: true,
          filter: [
            {
              name: 'Id',
              type: MultiselectFilterComponent,
              placeholder: 'Role Name',
              lazyOptions: (evt) => {
                return rolesAction(evt);
              },
            },
          ],
        },
        {
          field: 'isSystem',
          header: 'Is System',
          type: TableColumnType.Boolean,
          sortable: true,
          filter: [
            {
              name: 'IsSystem',
              type: BooleanFilterComponent,
              placeholder: 'Is System Role',
            },
          ],
        },
        {
          field: 'parentRoleId',
          header: 'Parent Role',
          sortable: true,
          parsedFullData: (item: RoleModel) =>
            !!item.parentRoleId ? this.roles.find((r) => r.value == item.parentRoleId)?.label : '',
          filter: [
            {
              name: 'ParentRoleId',
              type: MultiselectFilterComponent,
              placeholder: 'Parent Role',
              lazyOptions: (evt) => {
                return rolesAction(evt);
              },
            },
          ],
        },
      ],
      deleteEntity: (evt) => this.rolesService.delete(evt.id),
      getDataProvider: (evt) =>
        this.rolesService.getAll(evt).pipe(
          tap((x) => {
            this.roles = x?.data?.map((m) => {
              return {
                label: m.name,
                value: m.id,
              } as SelectItem;
            });
            return x;
          })
        ),
      createAction: () => this.router.navigate(['/configuration/security/roles', 'create']),
      editAction: (item: RoleModel) => {
        this.router.navigate(['/configuration/security/roles', item.id]);
      },
      showDeleteButton: false,
      showCreateButton: true,
      createLabel: 'Create Role',
      formRoute: 'users',
      title: 'Roles',
      preTitle: 'Security',
      stateKey: 'roles-table',
      permissions: {
        create: ['CreateRoles'],
        edit: ['EditRoles'],
        delete: ['DeleteRoles'],
      },
    });
  }
}

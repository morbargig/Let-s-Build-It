import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/@core';
import {
  faTable,
  faList,
  faBell,
  faCalendarAlt,
  faDownload,
  faEye,
  faTrashAlt,
  faFileUpload,
} from '@fortawesome/free-solid-svg-icons';
import { AclService } from '../../services/acl.service';
import { takeUntil, tap } from 'rxjs/operators';
import { PermissionModel } from '../../models/permission.model';
import { Observable } from 'rxjs';
import { AccountService } from '../../../../../../@shared/services/account.service';
import { RoleModel } from '../../../../../../@shared/models/role.model';
import { UtilsService } from '@app/@core/services/utils.service';
import { ColumnMode, TableColumn } from '@swimlane/ngx-datatable';
import { flatMap } from 'lodash';

@Component({
  selector: 'prx-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.scss'],
})
export class AclComponent extends BaseComponent implements OnInit {
  constructor(
    private aclService: AclService,
    private accountService: AccountService,
    private utilsService: UtilsService
  ) {
    super();
  }

  public expandedAcls: { [aclId: string]: boolean } = {};
  public aclsRoles: { [permissionId: string]: (RoleModel | any)[] }[] = [];
  private aclList: PermissionModel[] = [];
  public roles: RoleModel[] = null;
  public ColumnMode = ColumnMode;
  public columns: TableColumn[] = [];

  public views: any = {
    table: faTable,
    list: faList,
  };
  public icons: any = {
    download: faDownload,
    export: faFileUpload,
    eye: faEye,
    bell: faBell,
    trash: faTrashAlt,
    calendar: faCalendarAlt,
  };

  public aclList$: Observable<PermissionModel[]> = null;

  ngOnInit(): void {
    this.accountService
      .getRoles()
      .toPromise()
      .then((roles) => {
        this.roles = roles;
        this.columns = [
          {
            name: 'Permission',
            prop: 'permissionName',
            width: 320,
          },
          ...this.roles.map((r) => {
            return {
              name: r.name,
              prop: r.name,
            };
          }),
        ];
        this.aclList$ = this.aclService.getAcl().pipe(
          takeUntil(this.destroyyed),
          tap((x) => {
            this.aclList = x;
            let groupedByCategory = this.utilsService.groupBy(x, (x) => x.category);
            Object.keys(groupedByCategory).forEach((z) => {
              this.expandedAcls[z] = false;
              let permissions = groupedByCategory[z];
              this.aclsRoles[z] = [];
              permissions.forEach((permission) => {
                let groupByPermission = this.utilsService.groupBy(
                  [
                    ...this.roles.map((z) => {
                      return {
                        ...z,
                        selected: permission.roleIds.indexOf(z.id) >= 0,
                        permissionName: permission.systemName,
                      };
                    }),
                  ],
                  (x) => x.permissionName
                );
                Object.keys(groupByPermission).forEach((permissionName) => {
                  let obj: any = {
                    permissionName: permissionName,
                  };

                  groupByPermission[permissionName].forEach((role) => {
                    obj[role.name] =
                      permissions.find((z) => z.systemName == permissionName)?.roleIds?.indexOf(role.id) >= 0 || false;
                  });
                  this.aclsRoles[z].push(obj);
                });
              });
            });
          })
        );
      });
  }

  drillDown(permission: PermissionModel) {
    // this._invoices.getInvoiceDetails(invoice.id).subscribe((response) => {
    //   invoice.items = response.items;
    // });
  }

  public permissionChanged(permissionName: string, roleName: string, val: boolean) {
    let permissionId = this.aclList.find((z) => z.systemName == permissionName)?.id;
    let roleId = this.roles.find((z) => z.name == roleName)?.id;
    this.aclService
      .setPermissionRoleAccess(permissionId, roleId, val)
      .toPromise()
      .then((res) => {});
  }
}

import { Injectable } from '@angular/core';
import { AccountService } from '../../../@shared/services/account.service';
import { Permission } from '../permissions/permission';
import { CacheKeys } from './storage-keys.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private _permissions: any;

  public get permissions(): any {
    if (!this._permissions) {
      this._permissions = JSON.parse(localStorage.getItem(CacheKeys.PERMISSIONS));
    }

    return this._permissions;
  }

  public set permissions(permissions: any) {
    let permits = Object.keys(permissions).reduce((obj, module) => {
      return { ...obj, [module]: Object.keys(permissions[module]) };
    }, {});
    this._permissions = permits;
    localStorage.setItem(CacheKeys.PERMISSIONS, JSON.stringify(permits));
  }

  constructor(private account: AccountService) {
    this.account.listenToLoginState().subscribe((loggedIn) => {
      this._permissions = loggedIn ? this.account.permissions : null;
    });
  }

  public permitted(permission: Permission): boolean {
    if (!permission) {
      return true;
    }

    if (!!permission.roles) {
      const hasRole = this.account.roles.some((r) => permission.roles.includes(r));
      if (hasRole) {
        return true;
      }
    }

    if (permission.action) {
      return (
        !!this._permissions[permission.action.controller] &&
        this._permissions[permission.action.controller].includes(permission.action.name)
      );
    }

    if (!!permission.values) {
      const permissions = this.permissions;
      var permissionRoles = Object.keys(permissions)
        .filter((x) => permission.values.indexOf(x) >= 0)
        .map((x) => permissions[x]);

      return permissionRoles.some((pr) => this.account.roles.some((r) => pr.includes(r)));
    }
    return false;
  }
}

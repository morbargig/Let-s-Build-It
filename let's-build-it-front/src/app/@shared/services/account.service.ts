import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationResponseModel } from '../models/authentication.response';
import { environment } from '../../../environments/environment';
import { RoleModel } from '../models/role.model';
import { startWith, switchMap, tap, map } from 'rxjs/operators';
import { CacheKeys, StorageKeysService } from '@app/@ideo/infrastructure/services/storage-keys.service';
import { IPagedList } from '../models/paged-list.response';
import { RegisterContext } from '../../@core/authentication/authentication.models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _user: AuthenticationResponseModel;
  private loginState: EventEmitter<AuthenticationResponseModel> = new EventEmitter<AuthenticationResponseModel>();

  constructor(private http: HttpClient, private keys: StorageKeysService) { }

  public set user(val: AuthenticationResponseModel) {
    this._user = val;
    localStorage.setItem(CacheKeys.TOKEN, val.token);
    localStorage.setItem(CacheKeys.USER, JSON.stringify(val));
  }

  public get user(): AuthenticationResponseModel {
    if (!this._user) {
      this._user = JSON.parse(localStorage.getItem(CacheKeys.USER));
    }
    return this._user;
  }

  public get permissions(): any {
    return JSON.parse(localStorage.getItem(CacheKeys.PERMISSIONS));
  }
  public set permissions(permissions: any) {
    let permits = Object.keys(permissions).reduce((obj, module) => {
      return { ...obj, [module]: permissions[module] };
    }, {});
    localStorage.setItem(CacheKeys.PERMISSIONS, JSON.stringify(permits));
  }

  public get roles(): string[] {
    let currentUser = this.user;
    return !!currentUser ? currentUser.roles : [];
  }

  public get partnerId(): number {
    let currentUser = this.user;
    return !!currentUser?.partnerId ? currentUser.partnerId : null;
  }

  public get partnerFleetIds(): number[] {
    let currentUser = this.user;
    return !!currentUser ? currentUser.partnerFleetIds : [];
  }

  public get isLoggedIn(): boolean {
    return !!this.user;
  }

  public getUserPermissions(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/api/Account/Permissions`).pipe(
      tap((res) => {
        this.permissions = res;
      })
    );
  }

  public listenToLoginState(): Observable<AuthenticationResponseModel> {
    let currentState = !!this.isLoggedIn ? this.user : null;
    return this.loginState.pipe(startWith(currentState));
  }

  public authenticate(model: { employId: number; pass: string }): Observable<AuthenticationResponseModel> {
    return this.http.post<AuthenticationResponseModel>(`${environment.serverUrl}/api/Account/Authenticate`, model).pipe(
      tap((u) => {
        this.user = u;
      })
    );
  }

  public register(model: RegisterContext): Observable<AuthenticationResponseModel> {
    return this.http.post<AuthenticationResponseModel>(`${environment.serverUrl}/api/Account/Register`, model).pipe(
      tap((u) => {
        this.user = u;
      })
    );
  }

  public getRoles(): Observable<RoleModel[]> {
    return this.http.get<IPagedList<RoleModel>>(`${environment.serverUrl}/api/Security/Roles`).pipe(map((x) => x.data));
  }
}

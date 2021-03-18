import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { PermissionModel } from '../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class AclService {
  constructor(private http: HttpClient) {}

  public getAcl(): Observable<PermissionModel[]> {
    return this.http.get<PermissionModel[]>(`${environment.serverUrl}/api/Security/Acl`);
  }

  public setPermissionRoleAccess(permissionId: number, roleId: number, val: boolean): Observable<any> {
    return this.http.put(
      `${environment.serverUrl}/api/Security/Acl/${permissionId}/Role/${roleId}?hasAccess=${val}`,
      null
    );
  }
}

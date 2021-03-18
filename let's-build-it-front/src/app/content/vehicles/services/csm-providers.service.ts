import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsmProvidersService {
  constructor(private http: HttpClient) {}

  public getTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.serverUrl}/api/csm`);
  }
}

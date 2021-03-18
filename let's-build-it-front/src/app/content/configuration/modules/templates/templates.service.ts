import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { QueryBuilderService } from '../../../../@ideo/infrastructure/services/query-builder.service';
import { TemplateField, TemplateModel } from '../../../../@shared/models/template.model';
import { BaseHttpService } from '@app/@core/base/base-http-service';

@Injectable({
  providedIn: 'root',
})
export class TemplatesService extends BaseHttpService<TemplateModel>{
  public collationName: string = 'configuration/templates'
  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
  public create:any = null;
  public bulk:any = null;
  public delete:any = null;
  public update:any = null;

  public getFields(id: number): Observable<TemplateField[]> {
    return this.http.get<TemplateField[]>(`${environment.serverUrl}/api/configuration/templates/${id}/fields`);
  }

  public createTemplateValue(templateId: number, body: string): Observable<any> {
    return this.http.post<any>(`${environment.serverUrl}/api/configuration/templates/${templateId}`, body, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

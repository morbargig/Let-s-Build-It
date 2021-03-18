import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../@core/base/base-http-service';
import { BookingModel } from '../../@shared/models/booking.model';
import { HttpClient } from '@angular/common/http';
import { QueryBuilderService } from '../../@ideo/infrastructure/services/query-builder.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseHttpService<BookingModel> {
  public collationName: string = `Booking`;

  constructor(http: HttpClient, queryBuilder: QueryBuilderService) {
    super(http, queryBuilder)
  }
}



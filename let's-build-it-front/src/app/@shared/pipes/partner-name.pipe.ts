import { Pipe, PipeTransform } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { PartnersService } from '../../content/agencies/partners.service';
import { Observable } from 'rxjs';
import { PartnerModel } from '../models/partner.model';

@Pipe({
  name: 'partnerName',
  pure: false,
})
export class PartnerNamePipe implements PipeTransform {
  constructor(private partnersService: PartnersService) {}

  transform(carId: number): Promise<string> {
    return this.partnersService
      .get(carId)
      .pipe(
        map((x) => x.name),
        take(1)
      )
      .toPromise();
  }
}

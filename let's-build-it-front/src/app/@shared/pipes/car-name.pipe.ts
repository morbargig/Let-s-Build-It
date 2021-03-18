import { Pipe, PipeTransform } from '@angular/core';
import { CarsService } from '../../content/vehicles/services/cars.service';
import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CarModel } from '../models/car.model';

@Pipe({
  name: 'carName'
})
export class CarNamePipe implements PipeTransform {

  constructor(private carsService: CarsService) {
  }

  transform(carId: number): Promise<string> {
    return this.carsService.get(carId).pipe(map(x => `${x.model} ${x.modelYear}`), take(1)).toPromise();

  }

}

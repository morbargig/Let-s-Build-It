import { EventEmitter, Injectable } from '@angular/core';
import { TableModule } from '../table.module';

@Injectable()
export class SortService {
  constructor() {}

  public sort: EventEmitter<string> = new EventEmitter<string>();
}

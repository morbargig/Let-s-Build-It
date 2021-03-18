import { DecimalPipe } from '@angular/common';

export interface OrderOption {
  id?: number;
  partnerId?: number;
  name: string;
  price: number;
  created: Date;
  updated: Date;
}

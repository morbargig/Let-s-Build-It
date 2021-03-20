import { Component } from '@angular/core';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../@forms/form-fields/form-text/form-text.component';
import {
  FixedDiscountsModel,
  ChargesModel,
  DiscountsModel,
  DiscountType,
} from '../../../../@shared/models/discounts-and-charges.model';
import { FormGroup, Validators } from '@angular/forms';
import { DiscountsAndChargesService } from './discounts-and-charges.service';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { take } from 'rxjs/operators';
import { SelectItem } from '../../../../@ideo/components/table/models/select-item';
import { FilterObject, LazyLoadEvent } from '../../../../@ideo/components/table/events/lazy-load.event';
import { FormArrayComponent } from '../../../../@forms/form-fields/form-array/form-array.component';
import { FormArrayData } from '../../../../@forms/form-fields/form-array/form-array';
import { FormDateComponent } from '@app/@forms/form-fields';
import { range } from 'lodash';
import { FormSelectComponent } from '../../../../@forms/form-fields/form-select/form-select.component';
import { ErrorMessages } from '../../../../@shared/models/error-messages.model';
import { FieldEvent } from '../../../../@forms/@core/interfaces/events';
import { Subject } from 'rxjs';

@Component({
  selector: 'prx-discounts-and-charges',
  templateUrl: './discounts-and-charges.component.html',
  styleUrls: ['./discounts-and-charges.component.scss'],
})
export class DiscountsAndChargesComponent {
  public editMode: boolean = false;

  private _partnerId: number;
  public get partnerId() {
    if (!this._partnerId) {
      this._partnerId = this.sidebarService.entity.id;
    }
    return this._partnerId;
  }

  constructor(
    private discountsAndChargesService: DiscountsAndChargesService,
    private sidebarService: SideBarPageService
  ) {}
}

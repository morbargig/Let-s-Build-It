import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { ChargesModel } from '@app/@shared/models/discounts-and-charges.model';
import { take } from 'rxjs/operators';
import { DiscountsAndChargesService } from '../discounts-and-charges.service';
import { FixedDiscountsFormService } from './fixed-discounts-form.service';
import { FixedDiscountsModel } from '../../../../../@shared/models/discounts-and-charges.model';
import { WsiCardComponent } from '../../../../../@shared/components/wsi-card/wsi-card.component';
import { ErrorMessages } from '../../../../../@shared/models/error-messages.model';

@Component({
  selector: 'prx-fixed-discounts',
  templateUrl: './fixed-discounts.component.html',
  styleUrls: ['./fixed-discounts.component.scss'],
})
export class FixedDiscountsComponent implements OnInit {
  constructor(
    private fixedDiscountsFormService: FixedDiscountsFormService,
    private discountsAndChargesService: DiscountsAndChargesService
  ) {}

  public form: FormGroup;
  public touristForm: FormGroup;
  @Input() public partnerId: number;

  public fixedDiscountControls: DynamicFormControl[];
  public fixedDiscountItems: SelectItem[];
  public fixedDiscounts: FixedDiscountsModel = null;

  ngOnInit(): void {
    this.discountsAndChargesService
      .getFixedDiscounts(this.partnerId)
      .pipe(take(1))
      .subscribe((res) => {
        if (!!res) {
          this.fixedDiscounts = res;
          if (!!this.fixedDiscountControls?.length) {
            this.fixedDiscountControls.patchValue(this.fixedDiscounts);
          }
        }
        if (!this.fixedDiscountControls?.length) {
          this.fixedDiscountControls = this.fixedDiscountsFormService.generate(this.fixedDiscounts);
        }
        this.fixedDiscountItems = this.fixedDiscountControls.map((i) => {
          return {
            label: i.config?.label || i.config?.data?.text,
            styleClass: i.config?.styleClass,
            value: i?.config?.value,
          } as SelectItem;
        });
      });
  }

  onActiveFixedDiscounts(): void {
    this.discountsAndChargesService
      .updateFixedDiscounts(this.partnerId, this.fixedDiscounts)
      .toPromise()
      .then((res) => {
        if (!!res) {
          this.fixedDiscounts = res;
          this.fixedDiscountControls.patchValue(res);
          this.fixedDiscountItems = this.fixedDiscountControls.map((i) => {
            return {
              label: i.config.label || i.config?.data?.text,
              styleClass: i.config.styleClass,
              value: i?.config?.value,
            } as SelectItem;
          });
        }
      });
  }

  onFixedDiscountSubmit(divRef: WsiCardComponent, form: FormGroup): void {
    let newFixedDiscounts = form.getRawValue() as FixedDiscountsModel;
    newFixedDiscounts.isActive = true;
    let errorMessages: ErrorMessages = {
      200: 'Update Successfully',
    };
    let entityName = 'Fixed Discounts';
    this.discountsAndChargesService
      .updateFixedDiscounts(this.partnerId, newFixedDiscounts, errorMessages, entityName)
      .toPromise()
      .then((res) => {
        if (!!res) {
          let fixedDiscounts = this.fixedDiscounts;
          this.fixedDiscounts = { fixedDiscounts, ...res } as FixedDiscountsModel;
          this.fixedDiscountControls.patchValue(this.fixedDiscounts);
          this.fixedDiscountItems = this.fixedDiscountControls.map((i) => {
            return {
              label: i.config.label || i.config?.data?.text,
              styleClass: i.config.styleClass,
              value: i?.config?.value,
            } as SelectItem;
          });
          divRef.editMode = false;
        }
      });
  }
}

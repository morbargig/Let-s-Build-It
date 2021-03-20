import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DiscountsModel, DiscountType } from '../../../../../../@shared/models/discounts-and-charges.model';
import { ErrorMessages } from '../../../../../../@shared/models/error-messages.model';
import { DiscountsAndChargesService } from '../../discounts-and-charges.service';
import { DynamicFormControl } from '../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { DiscountFormService } from './discount-form.service';
import { MatchMode } from '../../../../../../@ideo/components/table/models/table-filter';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { FieldEvent } from '../../../../../../@forms/@core/interfaces/events';

@Component({
  selector: 'prx-discount-filler',
  templateUrl: './discount-filler.component.html',
  styleUrls: ['./discount-filler.component.scss'],
})
export class DiscountFillerComponent implements OnInit {
  constructor(
    private discountsAndChargesService: DiscountsAndChargesService,
    private discountFormService: DiscountFormService
  ) {}

  public controls: DynamicFormControl[];
  @Input() public title: string;
  @Input() public description: string;
  @Input() public partnerId: number;
  public enable: boolean = false;
  @Input() public discountType: DiscountType;
  private ended: EventEmitter<boolean> = new EventEmitter<boolean>();

  private formValueSnapshot: DiscountsModel[];

  private _form: FormGroup;
  public get form(): FormGroup {
    return this._form;
  }
  public set form(v: FormGroup) {
    if (!!this._form) {
      this._form.valueChanges.pipe(takeUntil(this.ended)).subscribe((res: any) => {
        if (!res) {
          this.formValueSnapshot = res;
          return;
        }
        let newRes = res?.[Object.keys(res)?.[0]];
        if (newRes && newRes.length) {
          if (this.formValueSnapshot?.length) {
            if (this.formValueSnapshot?.length - newRes?.length === 1) {
              let itemsIds = newRes.map((i: any) => i.id);
              let itemToRemoveIds: number[] = this.formValueSnapshot.map((i: any) => i.id);
              itemToRemoveIds.filter((i: any) => !itemsIds.includes(i));
              if (itemToRemoveIds.length) {
                let entityName = DiscountType?.[this.discountType] + ' Discount';
                let errorMessages: ErrorMessages = {
                  200: `${entityName}  Remove Successfully`,
                };
                if (!!itemToRemoveIds[0]) {
                  this.discountsAndChargesService
                    .delete(this.partnerId, itemToRemoveIds?.[0], errorMessages, entityName)
                    .toPromise();
                }
              }
            }
          }
        }
        this.formValueSnapshot = newRes;
      });
    }
    this._form = v;
    this.formValueSnapshot = v?.getRawValue()?.[Object.keys(v?.getRawValue())[0]];
  }

  ngOnDestroy(): void {
    this.ended.next(true);
  }

  ngOnInit(): void {
    this.getAndSetData();
  }

  getAndSetData() {
    this.discountsAndChargesService
      .getAll(this.partnerId, {
        page: 1,
        pageSize: 10,
        filters: {
          Type: {
            matchMode: MatchMode.Equals,
            value: this.discountType,
          },
        },
      })
      .toPromise()
      .then((discounts) => {
        this.controls = this.discountFormService.generate(this.discountType, discounts?.data);
        this.enable = !!discounts?.data?.length;
      });
  }

  onActiveType(): void {
    if (this.form && this.form?.getRawValue() && !!Object.keys(this.form?.getRawValue())?.length && this.enable) {
      let arr = this.formValueSnapshot?.map((i: any) => i?.id);
      let entityName = DiscountType?.[this.discountType] + ' Discount';
      let errorMessages: ErrorMessages = {
        200: `All ${entityName} Delete Successfully`,
      };
      this.discountsAndChargesService
        .deleteDiscounts(this.partnerId, arr, errorMessages, entityName)
        .toPromise()
        .then((res) => {
          (this.controls[0]?.config?.setter as Subject<FieldEvent>).next({ type: 'onPatchValue', value: [] });
        });
    }
    this.enable = !this.enable;
  }

  onSubmit() {
    let formVal = this.form.getRawValue();
    let formKeys = Object.keys(formVal);
    if (formKeys?.length == 1) {
      formVal = formVal[formKeys[0]];
    }
    let values = this.discountFormService.convert(formVal, null, { type: this.discountType });
    let entityName = DiscountType?.[this.discountType] + ' Discount';
    let updateErrorMessages: ErrorMessages = {
      200: `false`,
    };
    let crateErrorMessages: ErrorMessages = {
      200: `false`,
    };
    forkJoin(
      [
        ...values
          .filter((x) => !!x.id)
          .map((x) =>
            this.discountsAndChargesService.update(this.partnerId, x.id, x, updateErrorMessages, entityName).toPromise()
          ),
        ...values
          .filter((x) => !x.id)
          .map((x) =>
            this.discountsAndChargesService.create(this.partnerId, x, crateErrorMessages, entityName).toPromise()
          ),
      ].filter((z) => !!z)
    )
      .pipe(take(1))
      .subscribe((res) => {
        this.form.markAsPristine();
        this.form.markAsUntouched();
      });
  }
}

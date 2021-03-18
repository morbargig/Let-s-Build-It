import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChargesFormService } from './charges-form.service';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { DiscountsAndChargesService } from '../discounts-and-charges.service';
import { take } from 'rxjs/operators';
import { ChargesModel } from '../../../../../@shared/models/discounts-and-charges.model';
import { SelectItem } from '../../../../../@ideo/components/table/models/select-item';
import { WsiCardComponent } from '../../../../../@shared/components/wsi-card/wsi-card.component';
import { ErrorMessages } from '../../../../../@shared/models/error-messages.model';

@Component({
  selector: 'prx-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss'],
})
export class ChargesComponent implements OnInit, OnDestroy {

  constructor(private chargesFormService: ChargesFormService, private discountsAndChargesService: DiscountsAndChargesService) { }

  private _endded: EventEmitter<boolean> = new EventEmitter<boolean>();;

  public form: FormGroup;
  public touristForm: FormGroup;
  @Input() public partnerId: number;

  public chargesControls: DynamicFormControl[];
  public chargesItems: SelectItem[];

  public touristChargesControls: DynamicFormControl[];
  public touristChargesItems: SelectItem[];
  public charges: ChargesModel = null;

  ngOnInit(): void {
    this.discountsAndChargesService.getCharges(this.partnerId).pipe(take(1)).subscribe(res => {
      if (!!res) {
        this.charges = res
        if (!!this.chargesControls?.length) {
          this.chargesControls.patchValue(this.charges)
        }
        if (!!this.touristChargesControls?.length) {
          this.touristChargesControls.patchValue(this.charges)
        }
      }

      if (!this.chargesControls?.length) {
        this.chargesControls = this.chargesFormService.generate(this.charges);
      }
      if (!this.touristChargesControls?.length) {
        this.touristChargesControls = this.chargesFormService.generateTaxes(this.charges);
      }
      this.chargesItems = this.chargesControls.map(i => { return { label: i.config?.label || i.config?.data?.text, styleClass: i.config?.styleClass, value: i?.config?.value } as SelectItem })
      this.touristChargesItems = this.touristChargesControls.map(i => { return { label: i.config?.label || i.config?.data?.text, styleClass: i.config?.styleClass, value: i?.config?.value } as SelectItem })
    })
  }

  ngOnDestroy(): void {
    this._endded.next(true);
  }

  onChargesSubmit(divRef: WsiCardComponent, form: FormGroup, touristForm: FormGroup): void {
    let newCharges = form.getRawValue() as ChargesModel;
    let newTouristCharges = touristForm.getRawValue() as ChargesModel;
    for (let i in newCharges) {
      if (i.includes('null')) {
        delete newCharges[i]
      }
    }
    for (let i in newTouristCharges) {
      if (i.includes('null')) {
        delete newTouristCharges[i]
      }
    }

    let errorMessages: ErrorMessages = {
      200: 'Update Successfully',
    }
    let entityName = 'Charges'
    this.discountsAndChargesService.updateCharges(this.partnerId, { ...newCharges, ...newTouristCharges }, errorMessages, entityName).toPromise().then(res => {
      if (!!res) {
        let charges = this.charges
        this.charges = { charges, ...res, } as ChargesModel
        this.chargesControls.patchValue(this.charges)
        this.touristChargesControls.patchValue(this.charges)
        this.chargesItems = this.chargesControls.map(i => { return { label: i.config.label || i.config?.data?.text, styleClass: i.config.styleClass, value: i?.config?.value } as SelectItem })
        this.touristChargesItems = this.touristChargesControls.map(i => { return { label: i.config.label || i.config?.data?.text, styleClass: i.config.styleClass, value: i?.config?.value } as SelectItem })
        divRef.editMode = false
      }
    })
  }

}

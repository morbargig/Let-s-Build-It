import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { TariffsFormService } from '../tariffs-form.service';
import { take } from 'rxjs/operators';
import { PricesService } from '../prices.service';
import { SideBarPageService } from '../../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { FormArrayComponent } from '../../../../../@forms/form-fields/form-array/form-array.component';
import { Period, PartnerPriceModel, PartnerPriceValueModel } from '../../../../../@shared/models/partner-price.model';
import { FormGroup } from '@angular/forms';
import { ErrorMessages } from '../../../../../@shared/models/error-messages.model';

@Component({
  selector: 'prx-tariff-details',
  templateUrl: './tariff-details.component.html',
  styleUrls: ['./tariff-details.component.scss'],
})
export class TariffDetailsComponent implements OnInit {
  public editMode: boolean;
  public generalForm: FormGroup;
  public generalArrayForm: FormGroup[] = [];
  public generalControls: DynamicFormControl[];
  public generalArrayControls: DynamicFormControl[][];
  private _partnerId: number;
  public get partnerId() {
    if (!this._partnerId) {
      this._partnerId = this.sidebarService.entity.id;
    }
    return this._partnerId;
  }

  constructor(
    private tariffsFormService: TariffsFormService,
    private route: ActivatedRoute,
    private router: Router,
    private pricesService: PricesService,
    private sidebarService: SideBarPageService
  ) {
    this.route.params.pipe(take(1)).subscribe((params) => {
      if ('id' in params && !isNaN(+params.id) && typeof +params.id === 'number') {
        this.pricesService
          .get(this.partnerId, params.id)
          .toPromise()
          .then((res) => {
            if (!!res) {
              this.generalControls = this.tariffsFormService.generate(res).filter((i) => i.type !== FormArrayComponent);
              this.generalArrayControls = this.tariffsFormService.generateArrControl(res);
              this.generalControls.forEach((i) => {
                this.generalArrayForm.push(undefined as FormGroup);
              });
            }
          });
      }
    });
  }

  getName(index: number) {
    return Period[index + 1];
  }

  ngOnInit(): void {}
  disabled() {
    return [this.generalForm, ...this.generalArrayForm]?.filter((i) => i?.valid)?.length;
  }

  onSubmit(): void {
    let model: PartnerPriceModel = this.generalForm.getRawValue();
    let priceValues: PartnerPriceValueModel[] = [];
    for (let i of this.generalArrayForm) {
      priceValues.push(i.getRawValue());
    }
    let entityName = 'Partner Price';
    this.pricesService
      .update(this.partnerId, model.id, model, {}, entityName)
      .toPromise()
      .then((res) => {
        if (!!res) {
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });
  }
}

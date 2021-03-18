import { Component, OnInit } from '@angular/core';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { InventoryModel } from '../../../../../@shared/models/inventory.model';
import { FormGroup, Validators } from '@angular/forms';
import { InventoriesService } from '../../../../inventories/inventories.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
import { TableColumn, TableColumnType } from '../../../../../@ideo/components/table/models/table-column';
import { CarNamePipe } from '../../../../../@shared/pipes/car-name.pipe';
import { PartnerNamePipe } from '../../../../../@shared/pipes/partner-name.pipe';

@Component({
  selector: 'prx-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss'],
  providers: [CarNamePipe, PartnerNamePipe]
})
export class InventoryDetailsComponent implements OnInit {
  public columns: TableColumn<InventoryModel>[];
  public form: FormGroup;
  public generalControls: DynamicFormControl[] = [
    {
      type: FormTextComponent,
      config: {
        name: 'partnerId',
        type: 'text',
        label: 'Partner Id',
        placeholder: 'Enter Partner Id',
        value: this.inventory?.partnerId,
        styleClass: 'col-4',
        validation: [Validators.required],
        errorMessages: {
          required: 'Company Name is required',
        },
      },
    },
    {
      type: FormTextComponent,
      config: {
        name: 'chipProviderType',
        type: 'text',
        label: 'Chip Provider Type',
        placeholder: 'Enter Chip Provider Type',
        value: this.inventory?.chipProviderType,
        styleClass: 'col-4',
        validation: [Validators.required],
        errorMessages: {
          required: 'Partner Id is required',

        },
      },
    },
    {
      type: FormTextComponent,
      config: {
        name: 'externalId',
        type: 'text',
        label: 'H/W number',
        placeholder: 'Enter H/W number',
        value: this.inventory?.externalId,
        styleClass: 'col-4',
        validation: [Validators.required],
        errorMessages: {
          required: 'H/W number is required',

        },
      },
    },
    {
      type: FormTextComponent,
      config: {
        name: 'inventoryType',
        type: 'text',
        label: 'Inventory Type',
        placeholder: 'Enter Inventory Type',
        value: this.inventory?.inventoryType,
        styleClass: 'col-4',
        validation: [Validators.required],
        errorMessages: {
          required: 'Inventory Type is required',
        },
      },
    },
  ];

  private _inventory: InventoryModel;
  public get inventory(): InventoryModel {
    return this._inventory;
  }
  public set inventory(v: InventoryModel) {
    this._inventory = v;
  }



  constructor(private inventoriesService: InventoriesService, private route: ActivatedRoute, private partnerName: PartnerNamePipe, private carName: CarNamePipe) {
    this.route.params.pipe(take(1)).subscribe(
      params => {
        if ('id' in params) {
          let id = params.id
          this.inventoriesService.get(id).pipe(take(1)).subscribe(res => {
            this.inventory = res;
            this.generalControls.patchValue(this.inventory);
          })
        }
      },
    )
  }

  ngOnInit(): void {
    let partnersObs: Promise<string> = null;
    let carsObs: Promise<string> = null;
    this.columns = [
      {
        field: 'carId',
        header: 'Car',
        type: TableColumnType.Link,
        href: (evt: any) => {
          return [`/vehicles`, evt, 'profile', 'summary'];
        },
        parsedData$: (carId: number) => {
          if (!carsObs) {
            carsObs = this.carName.transform(carId);
          }
          return carsObs;
        }
      },
      {
        field: 'partnerId',
        header: 'Partner',
        type: TableColumnType.Link,
        href: (evt: any) => {
          return ['/agencies', evt, 'profile'];
        },
        parsedData$: (partnerId: number) => {
          if (!partnersObs) {
            partnersObs = this.partnerName.transform(partnerId);
          }
          return partnersObs;
        }
      }
    ]
  }

  patchGeneral(formValues: object): void {

  }

}





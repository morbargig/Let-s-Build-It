import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { BaseFieldDirective } from '@app/@forms/@core/directives/base-field.directive';
import { FieldConfig } from '@app/@forms/@core/interfaces';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { takeWhile } from 'rxjs/operators';
import { CarsService } from '../../vehicles/services/cars.service';
import { CarModel } from '../../../@shared/models/car.model';
import { TableColumn } from '../../../@ideo/components/table/models/table-column';

@Component({
  selector: 'prx-booking-vehicles-form',
  templateUrl: './booking-vehicles-form.component.html',
  styleUrls: ['./booking-vehicles-form.component.scss'],
})
export class BookingVehiclesFormComponent extends BaseFieldDirective<FormArray> implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;
  public id: string;
  public columns: TableColumn[];
  public items: CarModel[];
  public selectedItems: { [id: number]: boolean } = {};
  public selectedItemId: string;
  public evt: LazyLoadEvent;
  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private entityService: CarsService) {
    super();
  }

  ngOnInit(): void {
    this.columns = this.config.data.columns;
    this.columns.push({
      field: 'selected',
      filter: null,
      onClick: (model: CarModel) => {
        if (this.control?.value?.[0] === model) {
          this.control.setValue(null);
        } else {
          this.control.setValue([model]);
        }
      },
      parsedFullData: (model: CarModel) => {
        return this.control?.value?.[0] === model;
      },
      parsedHtmlData: (selected: boolean) => {
        if (!selected) {
          return `<div class="btn btn-primary"> Select</div>`;
        }
        return `<div class="btn btn-primary"> Remove</div>`;
      },
    } as TableColumn);
    this.evt = {
      page: 1,
      pageSize: 50,
    };
    this.entityService
      .getAll(this.evt)
      .pipe(takeWhile((r) => this.isAlive))
      .subscribe((res: IPagedList<CarModel>) => {
        if (res?.total) {
          this.items = res.data;
          this.selectedItems = this.items.reduce((prev, curr, i) => {
            prev[curr.id] = false;
            return prev;
          }, {});
          this.cd.markForCheck();
        }
      });
    this.group.controls[this.config.name] = this.fb.control(null, this.config.validation);
  }
}

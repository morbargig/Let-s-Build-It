import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseFieldDirective } from '../../../@forms/@core/directives/base-field.directive';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../@forms/@core/interfaces/field-config';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { UserModel } from '../../../@shared/models/user.model';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { takeWhile } from 'rxjs/operators';
import { UsersService } from '@app/content/users/services/users.service';
import { ButtonItem } from '../../../@ideo/core/models/button-item';
import { TableColumn } from '../../../@ideo/components/table/models/table-column';

@Component({
  selector: 'prx-booking-customer-form',
  templateUrl: './booking-customer-form.component.html',
  styleUrls: ['./booking-customer-form.component.scss']
})
export class BookingCustomerFormComponent extends BaseFieldDirective<FormArray> implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;
  public id: string;
  public columns: TableColumn[];
  public items: UserModel[];
  public selectedItems: { [id: number]: boolean } = {};
  public selectedItemId: string;
  public evt: LazyLoadEvent;
  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
    , private entityService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.columns = this.config.data.columns
    this.columns.push({
      field: 'selected',
      filter: null,
      onClick: (model: UserModel) => {
        if (this.control?.value?.[0] === model) {
          this.control.setValue(null)
        }
        else {
          this.control.setValue([model])
        }
      },
      parsedFullData: (model: UserModel) => {
        return this.control?.value?.[0] === model
      },
      parsedHtmlData: (selected: boolean) => {
        if (!selected) {
          return `<div class="btn btn-primary"> Select</div>`
        }
        return `<div class="btn btn-primary"> Remove</div>`
      },
    } as TableColumn)
    this.evt = {
      page: 1,
      pageSize: 50
    }
    this.entityService.getAll(this.evt).pipe(takeWhile(r => this.isAlive)).subscribe((res: IPagedList<UserModel>) => {
      if (res?.total) {
        this.items = res.data;
        this.selectedItems = this.items.reduce((prev, curr, i) => {
          prev[curr.id] = false;
          return prev;
        }, {})
        this.cd.markForCheck();
      }
    })
    this.group.controls[this.config.name] = this.fb.control(null, this.config.validation);
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseFieldDirective } from '../../../@forms/@core/directives/base-field.directive';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from '../../../@forms/@core/interfaces/field-config';
import { AncillaryModel } from '../../../@shared/models/ancillaries.model';

@Component({
  selector: 'prx-booking-dates-form',
  templateUrl: './booking-dates-form.component.html',
  styleUrls: ['./booking-dates-form.component.scss']
})
export class BookingDatesFormComponent extends BaseFieldDirective<FormArray> implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;
  public id: string;
  public items: AncillaryModel[];
  public selectedItems: { [id: number]: boolean } = {};
  public startDate: Date;
  public endDate: Date;

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    //   this.evt = {
    //     page: 1,
    //     pageSize: 50
    //   }
    //   this.evt.sorts = ['AncillaryGroup.Name'];
    //   this.ancillariesService.getAll(1, this.evt).pipe(takeWhile(r => this.isAlive)).subscribe((res: IPagedList<AncillaryModel>) => {
    //     if (res?.total) {
    //       this.items = res.data;
    //       this.selectedItems = this.items.reduce((prev, curr, i) => {
    //         prev[curr.id] = false;
    //         return prev;
    //       }, {})
    //       this.cd.markForCheck();
    //     }
    //   })
    this.group.controls[this.config.name] = this.fb.group({ startDate: null, endDate: null });

  }

  // public ancillarySelected(ancillary: AncillaryModel) {
  //   let index = (this.control.value as any[])?.findIndex(x => x?.id == ancillary.id);
  //   if (index >= 0) {
  //     this.control.removeAt(index);
  //     this.selectedItems[ancillary.id] = false;
  //   } else {
  //     this.control.push(this.fb.group(ancillary));
  //     this.selectedItems[ancillary.id] = true;
  //   }
  // }

  toggle() {
    this.startDate
  }
}
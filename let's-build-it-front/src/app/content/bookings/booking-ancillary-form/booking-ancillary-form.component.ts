import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseFieldDirective } from '../../../@forms/@core/directives/base-field.directive';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FieldConfig } from '../../../@forms/@core/interfaces/field-config';
import { AncillaryModel, AncillaryGroupModel } from '../../../@shared/models/ancillaries.model';
import { IPagedList } from '../../../@shared/models/paged-list.response';
import { takeWhile } from 'rxjs/operators';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { AncillariesService } from '../../agencies/components/ancillaries/ancillaries.service';
@Component({
  selector: 'prx-booking-ancillary-form',
  templateUrl: './booking-ancillary-form.component.html',
  styleUrls: ['./booking-ancillary-form.component.scss'],
})
export class BookingAncillaryFormComponent extends BaseFieldDirective<FormArray> implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;
  public id: string;
  public items: AncillaryModel[];
  public ancillaryGroupId: number;

  public selectedByGroup: { [id: number]: number } = {};
  public setAncillaryGroupId(id: number): void {
    this.ancillaryGroupId = id;
  }
  public selectedItems: { [id: number]: boolean } = {};
  public evt: LazyLoadEvent;

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private ancillariesService: AncillariesService) {
    super();
  }

  ngOnInit(): void {
    this.evt = {
      page: 1,
      pageSize: 50,
    };
    this.evt.sorts = ['AncillaryGroup.Name'];
    // FIXME: need to fix where i get the partner id
    this.ancillariesService
      .getAll(1, this.evt)
      .pipe(takeWhile((r) => this.isAlive))
      .subscribe((res: IPagedList<AncillaryModel>) => {
        if (res?.total) {
          this.items = res.data;
          this.selectedByGroup;
          this.selectedItems = this.items.reduce((prev, curr, i) => {
            prev[curr.id] = false;
            return prev;
          }, {});
          this.cd.markForCheck();
        }
      });
    this.group.controls[this.config.name] = this.fb.array([]);
  }

  public ancillarySelected(ancillary: AncillaryModel) {
    let index = (this.control.value as any[])?.findIndex((x) => x?.id == ancillary.id);
    if (index >= 0) {
      this.selectedByGroup[ancillary.ancillaryGroupId] = (this.selectedByGroup[ancillary.ancillaryGroupId] || 1) - 1;
      this.control.removeAt(index);
      this.selectedItems[ancillary.id] = false;
    } else {
      this.control.push(this.fb.group(ancillary));
      this.selectedItems[ancillary.id] = true;
      this.selectedByGroup[ancillary.ancillaryGroupId] = (this.selectedByGroup[ancillary.ancillaryGroupId] || 0) + 1;
    }
  }
}

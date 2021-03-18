import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { FieldConfig } from '@app/@forms/@core/interfaces';
import { BaseFieldDirective } from '../../../../../../@forms/@core/directives/base-field.directive';
import { Field } from '../../../../../../@forms/@core/interfaces/field';
import { SelectItem } from '../../../../../../@ideo/components/table/models/select-item';
import { asSelectItem } from '../../../../../../prototypes';
import { ZoneType, ZonePoint } from '../../../../../../@shared/models/partner-zone.model';
import { takeUntil } from 'rxjs/operators';
import { ZoneTypeField } from './zone-type.field';
import { FieldEvent } from '../../../../../../@forms/@core/interfaces/events';
import { Subject } from 'rxjs';

@Component({
  selector: 'prx-zone-type-form',
  templateUrl: './zone-type-form.component.html',
  styleUrls: ['./zone-type-form.component.scss']
})
export class ZoneTypeFormComponent extends BaseFieldDirective implements Field, OnInit, OnDestroy {
  public config: FieldConfig;
  public group: FormGroup;
  public id: string;
  public ended: EventEmitter<boolean> = new EventEmitter<boolean>();

  public points: ZonePoint[] = [];

  public options: SelectItem[] = asSelectItem(ZoneType);

  constructor(private fb: FormBuilder) {
    super();


  }


  optionSelected(option: ZoneType) {
    this.control.setValue(option);
    this.config.onChange({ action: 'setDrawingMode', data: option }, this.control)
  }

  ngOnInit(): void {
    // (this.config?.data as ZoneTypeField).overlayCompleted?.pipe(takeUntil(this.ended)).subscribe(res => {
    //   this.points = res;
    //   let arr = this.group.get('points') as FormArray;
    //   let setter = this.config.setter as Subject<FieldEvent>;
    //   arr.clear();
    //   setter.next({ type: 'onPatchValue', value: this.points })
    //   // this.points.forEach((p, i) => {
    //   //   arr.insert(i, this.fb.group({
    //   //     'longitude': [p.longitude],
    //   //     'latitude': [p.latitude],
    //   //     'radius': [p.radius],
    //   //   }))
    //   // })
    //   this.group.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  ngOnDestroy(): void {
    this.ended.next(true);
  }

}

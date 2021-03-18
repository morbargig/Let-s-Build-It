import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { FormSelectComponent, FormTextComponent } from '@app/@forms/form-fields';
import { AlertStatus } from '@app/@shared/interfaces/alert-status.enum';
import { AlertSubject } from '@app/@shared/interfaces/alert-subject.enum';
import { AlertModel } from '@app/@shared/models/alert.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { AlertsService } from '../../alerts.service';

@Component({
  selector: 'prx-tourist-visa-modal',
  templateUrl: './tourist-visa-modal.component.html',
  styleUrls: ['./tourist-visa-modal.component.scss'],
})
export class TouristVisaModalComponent implements OnInit {
  constructor(private bsModalRef: BsModalRef, private alertsService: AlertsService) {}

  public onClose: Subject<boolean> = new Subject<boolean>();
  public alert: AlertModel;
  public formControls: DynamicFormControl[];
  ngOnInit(): void {
    this.formControls = [
      {
        type: FormSelectComponent,
        config: {
          name: 'subjectStatus',
          label: 'Subject',
          placeholder: 'Select Subject Status',
          styleClass: 'col-12',
          value: this.alert.subjectStatus,
          validation: [],
          optionsArr: [
            { label: 'Approved as VAT exemption', value: 1 },
            { label: 'Declined as VAT exemption', value: 2 },
          ],
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'status',
          label: 'Status',
          placeholder: 'Select Status',
          value: this.alert.status,
          styleClass: 'col-12',
          validation: [Validators.required],
          optionsArr: Object.keys(AlertStatus)
            .filter((value) => isNaN(Number(value)) === false)
            .map((k) => {
              return {
                label: AlertStatus[k],
                value: parseInt(k),
              } as SelectItem;
            }),
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'comment',
          label: 'Comments',
          value: this.alert.comment,
          data: {
            rows: 4,
          },
        },
      },
    ];
  }

  public formSubmitted(formGroup: FormGroup) {
    let form = formGroup.getRawValue();
    const model = {
      alertId: this.alert.id,
      subject: AlertSubject.TouristVisa,
      subjectStatus: form.subjectStatus,
      status: form.status,
      comment: form.comment,
    };
    this.alertsService
      .updateStatus(this.alert.id, model)
      .toPromise()
      .then((res) => {
        this.onConfirm();
      });
  }

  public onConfirm(): void {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}

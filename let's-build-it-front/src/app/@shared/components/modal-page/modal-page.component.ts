import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ModalPageModelConfig } from './modal-page.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicFormControl } from '../../../@forms/@core/interfaces/dynamic-form-control';

@Component({
  selector: 'prx-modal-page',
  templateUrl: './modal-page.component.html',
  styleUrls: ['./modal-page.component.scss']
})
export class ModalPageComponent implements OnInit {
  private endded: EventEmitter<boolean> = new EventEmitter<boolean>();
  public modalPageConfig: ModalPageModelConfig = null;
  public form: FormGroup = {} as FormGroup;
  public entity: any = null;
  public loading: boolean = true;
  public formControls: DynamicFormControl[] = null;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {

    this.route.data.pipe(takeUntil(this.endded)).subscribe((data) => {
      this.modalPageConfig = data.config;
      this.modalPageConfig?.formControls?.pipe(takeUntil(this.endded)).subscribe(form => {
        this.formControls = form;
      });
      this.modalPageConfig?.closeEvent?.pipe(takeUntil(this.endded)).subscribe(form => {
        this.router.navigate([this.modalPageConfig.closeUrl], { relativeTo: this.route }).then(() => {
          this.endded.emit(true);
        })
      });
    });


  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.endded)).subscribe((params) => {
      this.modalPageConfig.getEntityById(params)?.toPromise().then((entity) => {
        this.entity = entity;
      }).finally(() => (this.loading = false))
    });
  }

  ngOnDestroy(): void {
    this.endded.emit(true);
  }

}

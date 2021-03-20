import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { DynamicFormControl } from '../../../@forms/@core/interfaces/dynamic-form-control';
import { takeUntil, debounceTime, filter } from 'rxjs/operators';
import { ModalAssignPageModelConfig } from './modal-assign-page.model';
import { LazyLoadEvent, FilterObject } from '../../../@ideo/components/table/events/lazy-load.event';
import { PickModel } from './pick.model';
import { Observable, Subject, config, Subscription } from 'rxjs';
import { MatchMode } from '../../../@ideo/components/table/models/table-filter';

@Component({
  selector: 'prx-modal-assign-page',
  templateUrl: './modal-assign-page.component.html',
  styleUrls: ['./modal-assign-page.component.scss'],
})
export class ModalAssignPageComponent implements OnInit {
  private ended: EventEmitter<boolean> = new EventEmitter<boolean>();
  public modalPageConfig: ModalAssignPageModelConfig = null;
  public entity: any = null;
  public loading: boolean = true;
  public formControls: DynamicFormControl[] = null;
  public evt: LazyLoadEvent | Observable<LazyLoadEvent>;
  private _items: PickModel[];
  private formChangedSubscription: Subscription;

  private _form: FormGroup;
  public get form(): FormGroup {
    return this._form;
  }
  public set form(v: FormGroup) {
    if (!!this.formChangedSubscription) {
      this.formChangedSubscription.unsubscribe();
    }
    this._form = v;
    if (!!this._form) {
      this.formChangedSubscription = this._form.valueChanges
        .pipe(debounceTime(300), takeUntil(this.ended))
        .subscribe((res) => {
          let filters: FilterObject = {};
          for (const key in res) {
            if (Object.prototype.hasOwnProperty.call(res, key)) {
              const filterValue = res[key];
              const controlConfiguration = this.formControls.find((c) => c.config.name == key);
              if (!!controlConfiguration) {
                filters[key] = {
                  matchMode:
                    typeof filterValue === 'number' || controlConfiguration.config?.type === 'number'
                      ? MatchMode.Equals
                      : MatchMode.Contains,
                  value: filterValue,
                };
              }
            }
          }
          let evt: LazyLoadEvent = { ...this.modalPageConfig.evt } as LazyLoadEvent;
          evt.filters = { ...evt.filters, ...filters };
          evt.page = 1;
          evt.pageSize = 10;
          this.modalPageConfig
            ?.getAll(evt)
            .toPromise()
            .then((res) => {
              this.items = res?.data || [];
            });
        });
    }
  }

  public get items() {
    return this._items;
  }

  public get selectedIdArr() {
    return this.selectedArr?.map((i) => i.id);
  }

  public set items(items) {
    items.forEach((i) => (i.active = this.selectedIdArr?.includes(i.id)));
    this._items = items;
  }

  public selected: PickModel;
  public selectedArr: PickModel[] = null;

  constructor(private route: ActivatedRoute, private router: Router) {
    let evt = { page: 1, pageSize: 10, filters: {} as FilterObject } as LazyLoadEvent;
    this.evt = evt;
    this.route.data.pipe(takeUntil(this.ended)).subscribe((data) => {
      this.modalPageConfig = data.config;
      this.formControls = this.modalPageConfig?.filterControls;

      if (this.modalPageConfig.evt) {
        if (this.modalPageConfig.evt instanceof Subject) {
          this.evtListener(this.modalPageConfig.evt as Subject<LazyLoadEvent>);
        }
        this.modalPageConfig
          ?.getAll(this.modalPageConfig.evt as LazyLoadEvent)
          .toPromise()
          .then((res) => {
            this.items = res?.data || [];
          });
      } else {
        this.modalPageConfig
          ?.getAll(evt)
          .toPromise()
          .then((res) => {
            this.items = res?.data || [];
          });
      }
      this.modalPageConfig?.closeEvent?.pipe(takeUntil(this.ended)).subscribe((form) => {
        this.router.navigate([this.modalPageConfig.closeUrl], { relativeTo: this.route }).then(() => {
          this.ended.emit(true);
        });
      });
    });
    this.route.params.pipe(takeUntil(this.ended)).subscribe((params) => {
      this.modalPageConfig
        .getEntityById(params)
        ?.toPromise()
        .then((entity) => {
          this.entity = entity;
        })
        .finally(() => (this.loading = false));
    });
  }

  public evtListener(evt: Subject<LazyLoadEvent>): void {
    this.evt = evt;
    this.evt.pipe(takeUntil(this.ended)).subscribe((res) => {
      this.modalPageConfig
        ?.getAll(res)
        .pipe(takeUntil(this.ended))
        .subscribe((res) => {
          this.items = res?.data || [];
        });
    });
  }

  ngOnInit(): void {}

  onSelect(selected: PickModel) {
    if (this.modalPageConfig?.multiSelected) {
      if (!this.selectedArr) {
        this.selectedArr = [];
      }
      if (!!this.selectedArr && this.selectedArr.includes(selected)) {
        this.selectedArr = this.selectedArr.filter((i) => i !== selected);
        this.selected = null;
        selected.active = false;
      } else {
        this.selectedArr.push(selected);
        this.selected = selected;
        selected.active = true;
      }
    } else {
      if (this.selected === selected) {
        this.selected.active = false;
        this.selected = null;
      } else {
        this.selected ? (this.selected.active = false) : null;
        selected.active = true;
        this.selected = selected;
      }
    }
  }

  ngOnDestroy(): void {
    this.ended.emit(true);
  }
}

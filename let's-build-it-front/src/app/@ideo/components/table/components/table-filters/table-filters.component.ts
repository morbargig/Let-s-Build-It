import { EventEmitter, Input, Output } from '@angular/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { TableColumn } from '../../models/table-column';
import { StorageKeysService } from '../../../../infrastructure/services/storage-keys.service';
import { LazyLoadEvent } from '../../events/lazy-load.event';
import { UtilsService } from '../../../../infrastructure/services/utils.service';

@Component({
  selector: 'table-filters',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.scss'],
})
export class TableFiltersComponent implements AfterViewInit {
  @Input() columns: TableColumn[];
  @Input() stateKey: string;
  @Output() filterEvent: EventEmitter<any> = new EventEmitter<any>();

  public appliedFilterCount: number;

  public isCollapsed = true;

  filtersDefaultValues: any;
  public group: FormGroup = this.fb.group({});

  public buttons: ButtonItem[] = [
    {
      label: 'Reset Filters',
      click: () => this.reset(),
      styleClass: 'btn-static position-relative btn pl-3 pr-4 mr-1',
      icon: 'fas fa-redo mr-1',
    },
  ];

  public applyBtn: ButtonItem = {
    label: 'Apply Filters',
    styleClass: 'btn-primary position-relative btn px-4 justify-self-end',
    click: () => this.applyFilters(true),
    disabled: !this.group.valid,
  };

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private storageKeysService: StorageKeysService) {}

  ngAfterViewInit(): void {
    this.filtersDefaultValues = this.group.getRawValue();
    const emit = this.setFiltersFromQueryParams(this.route.snapshot.queryParams);
    if (emit) {
      this.applyFilters();
    } else {
      this.loadStoredFilters();
    }
  }

  public applyFilters(saveFilters: boolean = false) {
    let values = this.group.getRawValue();
    Object.keys(values).forEach((name) => {
      if (values[name] === null || values[name] === undefined) {
        delete values[name];
      }
    });
    if (saveFilters) {
      const storedFilters = this.storageKeysService.getItem<LazyLoadEvent>(this.stateKey);
      if (storedFilters) {
        storedFilters.filters = values;
        this.storageKeysService.setItem(this.stateKey, storedFilters);
      }
    }
    //calculate filters number
    this.appliedFilterCount = 0;
    UtilsService.iterate(values, (obj, prop) => {
      //allow zero
      if (prop === 'value' && (!!obj[prop] || obj[prop] == 0)) {
        this.appliedFilterCount++;
      }
    });

    this.filterEvent.emit(values);
  }

  public reset() {
    let values = this.group.getRawValue();
    UtilsService.iterate(values, (obj, prop) => {
      if (prop === 'value') obj[prop] = null;
    });
    this.group.patchValue(values);
    //remove filters
    this.storageKeysService.removeItem(this.stateKey);
    this.appliedFilterCount = 0;
    const hasQueryParamsFilter = this.setFiltersFromQueryParams(this.route.snapshot.queryParams);
    if (hasQueryParamsFilter) {
      this.applyFilters(false);
    } else {
      this.filterEvent.emit({});
    }
  }

  public loadStoredFilters() {
    const storedFilters = this.storageKeysService.getItem<LazyLoadEvent>(this.stateKey);
    if (storedFilters) {
      this.group.patchValue(storedFilters.filters);
      this.applyFilters(false);
    }
  }

  public setFiltersFromQueryParams(params: Params): boolean {
    let keys = !!params && Object.keys(params);
    let emit = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (this.group.controls[key]) {
        (this.group.controls[key] as FormGroup).controls['value'].setValue(params[key]);
        emit = true;
      }
    }
    return emit;
  }
}

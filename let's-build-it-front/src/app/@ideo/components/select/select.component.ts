import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, finalize, take, tap } from 'rxjs/operators';
import { StringHelperService } from '../../infrastructure/services/string-helper.service';
import { LazyLoadEvent } from '../table/events/lazy-load.event';
import { SelectItem } from '../table/models/select-item';

@Component({
  selector: 'ideo-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements OnDestroy, ControlValueAccessor {
  @Output() public valueChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() public placeholder: string = 'Select';
  @Input() public dataKey: string;
  @Input() public pushOnly: boolean = false;
  @Input() public showClear: boolean = false;
  @Input() public showPlaceholder: boolean = true;
  @Input() public appendTo: string = 'body';
  @Input() public buttonStyleClass: string = '';
  @Input() public placement: string = 'bottom-right';

  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport;

  protected isAlive: boolean = true;
  public label: string;
  public id: string = `dropdown-${this.stringHelper.randomStr(4)}`;
  public value: any;

  public onChange: any = () => {};
  public onTouch: any = () => {};

  protected _disabled: boolean;
  public get disabled(): boolean {
    return this._disabled;
  }

  protected _options: SelectItem[];
  protected _optionObj: { [key: string]: any };
  @Input() public set options(arr: SelectItem[]) {
    this._optionObj = {};
    if (arr)
      arr.forEach((option) => {
        this._optionObj[!!this.dataKey ? option.value[this.dataKey] : option.value] = option.label;
      });
    this._options = arr;
    this.updateLabel();
  }
  public get options(): SelectItem[] {
    return this._options;
  }

  public asyncOptions: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);

  protected _lazyOptions: (evt: LazyLoadEvent) => Observable<IPagedList<SelectItem>> = null;
  @Input() public set lazyOptions(lazyOpt: (evt: LazyLoadEvent) => Observable<IPagedList<SelectItem>>) {
    if (!this._lazyOptions && !!lazyOpt) {
      this.options = [];
      this._lazyOptions = lazyOpt;
      this.updateLabel();
      this.asyncOptions
        .pipe(
          tap((arr) => {
            if (arr) {
              arr.forEach((option) => {
                this._optionObj[!!this.dataKey ? option.value[this.dataKey] : option.value] = option.label;
              });

              this.options.push(...arr);
            }
            return arr;
          })
        )
        .subscribe();
    }
  }

  public get lazyOptions(): (evt: LazyLoadEvent) => Observable<IPagedList<SelectItem>> {
    return this._lazyOptions;
  }

  public totalItems: number = 0;
  private currentFetch: Subscription;

  constructor(protected stringHelper: StringHelperService, protected cd: ChangeDetectorRef) {}
  ngOnDestroy(): void {
    this.isAlive = false;
  }

  public writeValue(val: any): void {
    if (val !== undefined && this.value !== val) {
      this.value = val;
      this.updateLabel();
      if (!!this.onChange) {
        this.onChange(this.value);
      }
      this.cd.markForCheck();
    }
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.cd.markForCheck();
  }

  public optionClicked(val: any): void {
    if (val !== undefined && this.value !== val) {
      if (!this.pushOnly) {
        this.value = val;
        this.updateLabel();
      }
      this.onChange(val);
      this.onTouch(val);
      this.valueChanged.emit(val);
    }
    if (this.options?.filter((i) => i.value === val)?.[0]?.click) {
      this.options?.filter((i) => i.value === val)?.[0]?.click(null);
    }
  }

  public updateLabel(label?: string) {
    this.label =
      (!!this.value || this.value === 0 || this.value === false) && this._optionObj
        ? this._optionObj[!!this.dataKey ? this.value[this.dataKey] : this.value]
        : '';
  }

  public fixIcon(icon: IconDefinition | string): string {
    if (!icon) return '';
    if (typeof icon === 'string') {
      return icon;
    }
    return icon?.prefix.toString() + ' fa-' + icon?.iconName.toString();
  }

  public focused() {
    this.onTouch(this.value);
  }

  nextBatch(currIndex: number, items: any[]) {
    const start = this.viewPort.getRenderedRange().start;

    const end = this.viewPort.getRenderedRange().end;
    const total = this.viewPort.getDataLength();

    if (end == total && (!this.totalItems || end < this.totalItems)) {
      if (!!this.currentFetch) {
        this.currentFetch.unsubscribe();
        this.currentFetch = null;
      }
      this.currentFetch = this.lazyOptions({ page: (!!end ? end / 5 : 0) + 1, pageSize: 5 })
        .pipe(
          debounceTime(300),
          take(1),
          finalize(() => {
            this.currentFetch.unsubscribe();
            this.currentFetch = null;
          })
        )
        .subscribe((res) => {
          this.totalItems = res?.total || 0;
          this.asyncOptions.next([...this.asyncOptions.value, ...(res?.data || [])].filter((x) => !!x));
        });
    }
  }

  trackByIdx(i: number) {
    return i;
  }

  public scrollEnd() {
    const end = this.viewPort?.getRenderedRange().end;
    if (!!this.totalItems && !!end && end > 5) {
      setTimeout(() => {
        this.viewPort?.scrollToIndex(end - 5, 'smooth');
        this.cd.markForCheck();
      });
    }
  }
}

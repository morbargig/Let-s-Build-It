import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, Observable, of } from 'rxjs';
import { catchError, debounceTime, switchMap, takeWhile } from 'rxjs/operators';
import { StringHelperService } from '../../infrastructure/services/string-helper.service';
import { SelectComponent } from '../select/select.component';
import { SelectItem } from '../table/models/select-item';

@Component({
  selector: 'ideo-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent extends SelectComponent implements OnInit {
  private filterByQuery: Subject<string> = new Subject<string>();

  public focus: boolean = false;
  public query: string = '';
  public label: string;

  @Input() public queryOnPanelOpen: boolean = false;
  @Input() public dataKey: string;
  @Input() public labelKey: string;
  @Input() public resolveLabel: (val: any) => Promise<string> | string;
  @Input() public optionsFetcher: (query: string) => Observable<SelectItem[]>;

  constructor(stringHelper: StringHelperService, cd: ChangeDetectorRef) {
    super(stringHelper, cd);
  }

  ngOnInit(): void {
    this.filterByQuery
      .pipe(
        debounceTime(300),
        switchMap((query: string) => this.optionsFetcher(query).pipe(catchError((err) => of([])))),
        takeWhile((x) => this.isAlive)
      )
      .subscribe((list) => this.updateList(list));
  }

  public filter(value: string) {
    this.query = value;
    this.filterByQuery.next(value);
  }

  public writeValue(val: any): void {
    if (val !== undefined && this.value !== val) {
      this.value = val;
      if (this.resolveLabel) {
        let resolver = this.resolveLabel(val);
        if (typeof resolver === 'string') {
          this.updateLabel(resolver);
        } else resolver.then((label) => this.updateLabel(label));
      } else {
        this.updateLabel(val);
      }
    }
  }

  public updateLabel(label: string) {
    if (label !== undefined) {
      this.label = label;
      this.cd.markForCheck();
    }
  }

  private updateList(list: SelectItem[]) {
    this.options = list;
    this.cd.markForCheck();
  }

  public optionClicked(val: any): void {
    if (val !== undefined && this.value !== val) {
      this.label = val[this.labelKey] || val;
      this.value = val[this.dataKey] || val;
      this.onChange(this.value);
      this.onTouch(this.value);
      this.valueChanged.emit(val);
    }
  }

  public openChange(isOpen: boolean) {
    if (isOpen) {
      this.filterByQuery.next(this.query);
    } else {
      this.updateList([]);
    }
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StringHelperService } from '../../infrastructure/services/string-helper.service';

@Component({
  selector: 'ideo-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true,
    },
  ],
})
export class CalendarComponent implements OnInit, ControlValueAccessor {
  @Output() public onChangeEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() public type: 'time' | 'datetime-local' | 'month' | 'date' = 'datetime-local';
  @Input() public inputClass: string;

  public onChange: any = () => { };
  public onTouch: any = () => { };
  public id: string = `calendar-${this.stringHelper.randomStr(4)}`;
  public disabled: boolean;
  private _utcValue: string;
  public presentationValue: string;

  constructor(
    private stringHelper: StringHelperService,
    // private timezoneService: TimezoneService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  public writeValue(date: string): void {
    if (new Date(date).getFullYear() === 1) {
      return;
    } else if (this.type == 'datetime-local') {
      this._utcValue = date;
      // this.presentationValue = date ? this.timezoneService.fromUtcToPresentation(date) : '';
    } else {
      this.presentationValue = date;
    }
    this.cd.markForCheck();
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onInputChange(date: string) {
    if (this.type == 'datetime-local') {
      // this._utcValue = date ? this.timezoneService.fromPresentationToUtc(date) : '';
      this.onChange(this._utcValue);
      this.onTouch(this._utcValue);
      this.onChangeEvent.emit(this._utcValue);
    } else {
      this.onChange(this.presentationValue);
      this.onTouch(this.presentationValue);
      this.onChangeEvent.emit(this.presentationValue);
    }
  }
}

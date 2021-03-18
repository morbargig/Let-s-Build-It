import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, OnDestroy, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SelectItem } from '../../interfaces';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ideo-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss'],
})
export class ValidationMessagesComponent implements OnInit, OnDestroy {
  public errorMessages: SelectItem[];
  private endded = new EventEmitter<boolean>();

  @Input() public takeOne: boolean = true;
  @Input() public autoShowErrors: boolean = false;
  @Input() public control: AbstractControl;
  @Input() public set messages(msgObj: { [error: string]: string }) {
    if (!!msgObj) {
      this.errorMessages = [...this.getErrorMessages(msgObj)];
      setTimeout(() => this.cd.detectChanges())
    }
  }

  constructor(private cd: ChangeDetectorRef) { }
  ngOnDestroy(): void {
    this.endded.next(true);
  }

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntil(this.endded)).subscribe(res => {
      if (this.errorMessages?.some(x => x.value == 'pattern')) {
      }
      setTimeout(() => this.cd.detectChanges())
    })
  }

  private getErrorMessages(msgObj: { [error: string]: string }): SelectItem[] {
    var arr: SelectItem[] = [];
    const keys: string[] = Object.keys(msgObj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      arr.push({ label: msgObj[key], value: key });
    }
    return arr;
  }
}

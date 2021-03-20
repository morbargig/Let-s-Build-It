import { Component, Input, OnInit, Output, EventEmitter, Type, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalMessage } from '../../../@core/models/modal-message';
import { KEY_CODE } from '../../models/key-code.model';

@Component({
  selector: 'prx-wsi-modal',
  templateUrl: './wsi-modal.component.html',
  styleUrls: ['./wsi-modal.component.scss'],
})
export class WsiModalComponent implements OnInit {
  @Input() public title: string;
  @Input() public type: Subject<ModalMessage>;
  public typeObj: ModalMessage;
  @Input() public close: string;
  @Input() public isValidForm: boolean;
  @Output() public submit: EventEmitter<boolean> = new EventEmitter<boolean>();
  public started: boolean = false;
  public isClosing: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event?.code === KEY_CODE.ESC) {
      this.discardModal();
    }
  }
  ngOnInit(): void {
    this.type?.pipe(takeUntil(this.submit)).subscribe((res) => {
      this.typeObj = res;
    });
    setTimeout(() => {
      this.started = true;
    });
  }

  onSubmit(): void {
    this.submit.next(true);
  }

  public discardModal() {
    this.isClosing = true;
    let closeUrl = this.typeObj?.closeUrl || this.close || '../';
    setTimeout(() => {
      this.router.navigate([closeUrl], { relativeTo: this.route });
    }, 150);
  }

  public onKeyPress(evt: any) {
    debugger;
  }
}

import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { CarMedia } from '../../models/car.model';

@Component({
  selector: 'prx-full-screen-modal',
  templateUrl: './full-screen-modal.component.html',
  styleUrls: ['./full-screen-modal.component.scss'],
})
export class FullScreenModalComponent implements OnInit {
  constructor(private bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  public onClose: Subject<boolean> = new Subject<boolean>();
  public mediaItem: CarMedia;
  public title: string = null;

  public onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}

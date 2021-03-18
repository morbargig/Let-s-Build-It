import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'prx-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  constructor(private bsModalRef: BsModalRef) {
    this.modalRef = bsModalRef;
  }
  public onClose: Subject<boolean> = new Subject<boolean>();
  public modalRef: BsModalRef;
  public message: string;

  ngOnInit(): void {}

  public onConfirm(): void {
    this.onClose.next(true);
    this.modalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.modalRef.hide();
  }
}

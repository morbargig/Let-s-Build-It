import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { AuditLogModel } from '../../models/audiit-log';

@Component({
  selector: 'prx-audit-log-details-modal',
  templateUrl: './audit-log-details-modal.component.html',
  styleUrls: ['./audit-log-details-modal.component.scss'],
})
export class AuditLogDetailsModalComponent implements OnInit, AuditLogModel {
  constructor(private bsModalRef: BsModalRef) {
    this.modalRef = bsModalRef;
  }
  public id: number;
  public userId: number;
  public entityId: number;
  public entityType: string;
  public action: string;
  public actionString: string;
  public keyValues?: string;
  public newValues?: string;
  public oldValues?: string;
  public updated: Date;
  public created: Date;

  public onClose: Subject<boolean> = new Subject<boolean>();
  public modalRef: BsModalRef;
  public items: { property: string; oldValue: any; newValue: any }[] = [];

  ngOnInit(): void {
    let auditLog = this as AuditLogModel;
    if (!!auditLog) {
      let oldValues = !!auditLog.oldValues ? JSON.parse(auditLog.oldValues) : null;
      let newValues = !!auditLog.newValues
        ? JSON.parse(auditLog.newValues)
        : !!auditLog.keyValues
        ? JSON.parse(auditLog.keyValues)
        : null;
      let oldValuesKeys = !!oldValues ? Object.keys(oldValues) : null;
      let newValuesKeys = !!newValues ? Object.keys(newValues) : null;
      let max = Math.max(oldValuesKeys?.length || 0, newValuesKeys?.length || 0);
      for (let i = 0; i < max; i++) {
        this.items.push({
          property: newValuesKeys[i],
          oldValue: !!oldValues ? oldValues[newValuesKeys[i]] : '',
          newValue: newValues ? newValues[newValuesKeys[i]] : '',
        });
      }
    }
  }

  public onConfirm(): void {
    this.onClose.next(true);
    this.modalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.modalRef.hide();
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditLogsRoutingModule } from './audit-logs-routing.module';
import { AuditLogDetailsModalComponent } from './components/audit-log-details-modal/audit-log-details-modal.component';

@NgModule({
  declarations: [AuditLogDetailsModalComponent],
  imports: [CommonModule, AuditLogsRoutingModule],
})
export class AuditLogsModule {}

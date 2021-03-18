export interface AuditLogModel {
  id: number;
  userId: number;
  entityId: number;
  entityType: string;
  action: string;
  actionString: string;
  keyValues?: string;
  newValues?: string;
  oldValues?: string;
  updated: Date;
  created: Date;
}

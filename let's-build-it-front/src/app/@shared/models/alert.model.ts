import { AlertStatus } from '../interfaces/alert-status.enum';
import { AlertSubject } from '../interfaces/alert-subject.enum';
import { AlertSubjectStatus } from '../interfaces/alert-subject-status.enum';

export interface AlertModel {
  id?: number;
  userId: number;
  orderId?: number;
  carId?: number;
  subject?: AlertSubject;
  subjectStatus?: AlertSubjectStatus;
  status?: AlertStatus;
  comment: string;
  createUserId: number;
  updateUserId: number;
  created: Date;
  updated: Date;
}

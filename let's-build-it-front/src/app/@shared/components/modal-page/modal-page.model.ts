import { DynamicFormControl } from '../../../@forms/@core/interfaces/dynamic-form-control';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ModalMessage } from '../../../@core/models/modal-message';
export interface ModalPageModelConfig {
  title?: string;
  type?: Subject<ModalMessage> | BehaviorSubject<ModalMessage>;
  closeUrl?: string;
  submit?: (value: any) => any;
  formControls: Subject<DynamicFormControl[]>;
  getEntityById?: (routeParams: any) => Observable<any>;
  closeEvent?: Subject<boolean>;
}

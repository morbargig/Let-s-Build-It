import { DynamicFormControl } from '../../../@forms/@core/interfaces/dynamic-form-control';
import { Observable, Subject } from 'rxjs';
import { ModalMessage } from '../../../@core/models/modal-message';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { PickModel } from './pick.model';
import { IPagedList } from '../../models/paged-list.response';

export interface ModalAssignPageModelConfig {
  notificationsMessages?: { succuss: string; error: string };
  type?: Subject<ModalMessage>;
  submit?: (value: any, entity: any) => any;
  filterControls: DynamicFormControl[];
  getEntityById?: (routeParams: any) => Observable<any>;
  getAll?: (evt: LazyLoadEvent) => Observable<IPagedList<PickModel>>;
  multiSelected: boolean;
  evt: LazyLoadEvent | Subject<LazyLoadEvent>;
  closeEvent: Subject<boolean>;
  closeUrl: string;
  noCheckbox: boolean;
}

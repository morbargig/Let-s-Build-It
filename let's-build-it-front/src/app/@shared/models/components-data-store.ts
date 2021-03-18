import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentDataStore<T = any> {
  selectionSubject: Observable<T[]>;
  refreshData: (spreadItems?: boolean, resetPagination?: boolean) => void;
  // openForm: (formRoute: string, entity?: any) => void;
  route: ActivatedRoute;
}

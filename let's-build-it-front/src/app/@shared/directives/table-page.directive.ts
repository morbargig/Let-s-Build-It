import { Directive, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { BaseComponent } from '@app/@core/base/base-component';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn } from '@app/@ideo/components/table/models/table-column';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { TableComponent } from '@app/@ideo/components/table/table.component';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { Observable, of, Subject } from 'rxjs';
import { ITabledPage } from '../interfaces/itabled.page';
import { ToolbarAction } from '../models/tool-bar.action';
import { IPagedList } from '../models/paged-list.response';
import { catchError, filter, switchMap, take, takeWhile, takeUntil, debounceTime, skip } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DeleteModalComponent } from '../components/delete-modal/delete-modal.component';
import { faFileUpload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { NotificationsService } from '../../@ideo/components/notifications/notifications.service';
import { ImportComponent } from '../components/import/import.component';
import { DynamicFormControl } from '../../@forms/@core/interfaces/dynamic-form-control';
import { ImportConfig } from '../models/import.config';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Directive()
export abstract class TablePageDirective<T = any> extends BaseComponent implements ITabledPage<T>, OnDestroy {
  protected dataSubject: Subject<LazyLoadEvent> = new Subject<LazyLoadEvent>();

  @ViewChild('tc', { static: false }) public tc: TableComponent;

  public totalRecords: number;
  public items: T[];
  public lazy: boolean = true;
  public loadingData: boolean = true;
  public topRightButtons: ToolbarAction[] = [
    {
      label: 'Export Page',
      icon: 'fas fa-download',
      optionsArr: [
        { label: 'Excel', icon: 'fas fa-file-excel', click: (evt: any) => this.tc.export(false) },
        { label: 'Csv', icon: 'fas fa-file-csv', click: (evt: any) => this.tc.export(false, 'Csv') },
      ],
      faIcon: faFileUpload,
      click: (evt) => this.tc.export(false),
    },
    { label: 'Export All', icon: 'fas fa-download', faIcon: faUpload, click: (evt) => this.tc.export(true) },
    {
      label: 'Import',
      icon: 'fas fa-file-import',
      faIcon: faUpload,
      click: (evt) =>
        (this.modalService.show(ImportComponent, {
          initialState: { config: this.importConfig },
          class: 'modal fullscreen modal-dialog-centered',
        }).content as ImportComponent).onClose
          .pipe(take(1))
          .subscribe((res) => {
            if (res) {
              this.getData();
            }
            //ToDo: show an alert with errors.
          }),
    },
  ];

  public selectionSubject: Subject<T[]> = new Subject<T[]>();
  public _selection: T[];
  public set selection(selection: T[]) {
    this.selectionSubject.next(selection);
    this._selection = selection;
  }
  public get selection(): T[] {
    return this._selection;
  }

  public initSelection: number[];

  public abstract importConfig?: ImportConfig;
  public abstract columns: TableColumn<T>[];
  public abstract pageActions: ButtonItem[];
  public abstract filters: TableFilter[];
  public abstract itemActions: ButtonItem<T>[];

  public abstract getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<T>>;
  public abstract deleteEntity(item: T): Observable<any>;

  constructor(
    //protected baseService: BaseService,
    protected modalService: BsModalService,
    private refreshOnAccountChange: boolean = true,
    protected notificationsService: NotificationsService,
    protected router: Router
  ) {
    super();
    this.initDataSubject();
    const pageUrl = this.router.url;
    this.router.events
      .pipe(
        takeUntil(this.destroyyed),
        takeWhile((x) => this.isAlive),
        filter((x) => x instanceof NavigationEnd && x.url == pageUrl),
        debounceTime(100),
        skip(1)
      )
      .subscribe((res: NavigationEnd) => {
        this.getData();
      });
  }

  getData() {
    this.tc.getData();
  }

  private initDataSubject() {
    this.dataSubject
      .pipe(
        takeWhile((x) => this.isAlive),
        switchMap((evt) => {
          return this.getDataProvider(evt).pipe(catchError((err) => of(err)));
        })
      )
      .subscribe((res) => {
        if (!res.error) {
          this.items = res.data;
          this.totalRecords = res.total;
        }
        this.loadingData = false;
      });
  }

  public onLazyLoad(evt: LazyLoadEvent): void {
    if (!evt.exportType) {
      // this.loadingData = false;
      this.dataSubject.next(evt);
    } else {
      this.getDataProvider(evt, true);
    }
  }

  public openForm(formRoute: string, entity: any = null) {
    // this.baseService.openForm(formRoute, entity).pipe(take(1), takeWhile(x => this.isAlive)).subscribe(res => {
    //   this.tc.getData()
    // })
  }

  public deleteItem(item: any, message: string = null): void {
    const a = this.modalService.show(DeleteModalComponent, {
      initialState: { id: item.id, name: item.name, message: message },
      class: 'modal-md modal-dialog-centered',
    });
    (<DeleteModalComponent>a.content).onClose.pipe(take(1)).subscribe((deleteIt) => {
      if (!!deleteIt) {
        this.deleteEntity(item)?.subscribe((res) => {
          if (!!res) {
            this.notificationsService.success(`${!!item.name ? item.name : 'Item'} deleted successfully.`);
            this.tc.getData();
          }
        });
      }
    });
  }
}

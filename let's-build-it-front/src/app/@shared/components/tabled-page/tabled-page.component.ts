import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from '@app/@ideo/components/table/events/lazy-load.event';
import { TableColumn } from '@app/@ideo/components/table/models/table-column';
import { TableFilter } from '@app/@ideo/components/table/models/table-filter';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { TablePageDirective } from '@app/@shared/directives/table-page.directive';
import { BasePageConfig } from '@app/@shared/models/base-page.config';
import { ComponentDataStore } from '@app/@shared/models/components-data-store';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { TablePermissions } from '../../models/base-page.config';
import { NotificationsService } from '../../../@ideo/components/notifications/notifications.service';
import { ImportConfig } from '@app/@shared/models/import.config';

@Component({
  selector: 'prx-tabled-page',
  templateUrl: './tabled-page.component.html',
  styleUrls: ['./tabled-page.component.scss'],
})
export class TabledPageComponent<T = any> extends TablePageDirective<T> implements OnInit {
  constructor(router: Router, private route: ActivatedRoute, modalService: BsModalService, notificationsService: NotificationsService) {
    super(modalService, true, notificationsService, router);
    // if (!!this.route.snapshot.data && !!this.route.snapshot.data.config) {
    //   this.config = this.route.snapshot.data.config;
    // }
  }

  public columns: TableColumn<any>[];
  public importConfig?: ImportConfig;
  public pageActions: ButtonItem<any>[];
  public filters: TableFilter[];
  public itemActions: ButtonItem<any>[];
  public selectionMode: SelectionMode;
  // public topRightButtons: ToolbarAction[];
  public isReloadable: boolean = true;

  public title: string;

  private _config: BasePageConfig<any>;
  @Input()
  public get config(): BasePageConfig {
    return this._config;
  }
  public set config(config: BasePageConfig) {
    this._config = config;

    let dataStore: ComponentDataStore = {
      selectionSubject: this.selectionSubject.pipe(takeWhile(() => this.isAlive)),
      refreshData: (spread, resetPages) => (!spread ? this.getData() : (this.items = [...this.items])),
      // openForm: (route, entity) => this.openForm(route, entity),
      route: this.route,
    };
    if (!!config.registerDataStore) {
      config.registerDataStore(dataStore);
    }
    this.pageActions = config.getPageActions(dataStore);

    this.columns = config.columns;
    this.filters = config.filters;
    this.itemActions = config.itemActions;
    this.selectionMode = config.selectionMode;
    this.lazy = config.lazy;

    if (!!config.selectionMode) {
      this.topRightButtons.unshift({
        label: 'Export Selected',
        icon: 'fas fa-download',
        click: (evt) => this.tc.exportSelection(),
        // permission: { action: { controller: config.controllerName, name: Actions.Export } }
      });
    }

    this.title = config.title;
    if (!!config.importConfig) {
      this.importConfig = config.importConfig;
      // this.topRightButtons.push(
      //   {
      //     label: 'Import', icon: 'fas fa-upload', click: (evt) => {
      //       //this.openForm('import', config.importConfig )
      //       let modalRef = this.modalService.open(ImportDataComponent, { size: 'xl' });
      //       (modalRef.componentInstance as ImportDataComponent).config = config.importConfig;
      //     },
      //     permission: {
      //       action: {
      //         controller: config.controllerName,
      //         name: Actions.Import
      //       }
      //     },
      //   });
    }
    if (!config.topRightAppendExport) {
      this.topRightButtons = null;
    } else {
      // this.topRightButtons.forEach((x) => {
      //   if (x.label.includes('Export')) {
      //     x.permission = {
      //       values: this.config.permissions[],
      //     }
      //   }
      // });
    }

    if (config.topRightButtons) {
      this.topRightButtons = config.topRightAppendExport
        ? this.topRightButtons.concat(config.topRightButtons)
        : config.topRightButtons;
    }

    if (config.initSelections$) {
      this.config.initSelections$ = config.initSelections$;
    }

    if (config.formRoute) {
      //Create
      if (config.showCreateButton && !!config.permissions) {
        this.pageActions.push({
          label: config.createLabel,
          permission: { values: config.permissions[TablePermissions.Create] },
          click: () => this.config.createAction(),
        });
      }
      //Edit
      if (config.showEditButton && !!config.permissions) {
        this.itemActions.push({
          tooltip: config.editLabel,
          icon: 'fas fa-edit',
          styleClass: 'btn-outline-primary ml-2',
          permission: { values: config.permissions[TablePermissions.Edit] },
          hidden: () => false,
          click: (item) => {
            if (!!this.config.editAction) {
              this.config.editAction(item);
            }
          },

          // this.openForm(`${config.formRoute}/${item.id}`, item)
        });
      }
    }
    //Delete
    if (config.showDeleteButton && !!config.permissions) {
      this.itemActions.push({
        tooltip: config.deleteLabel,
        icon: 'fas fa-trash',
        permission: { values: config.permissions[TablePermissions.Delete] },
        hidden: () => false,
        click: (item) => this.deleteItem(item),
        styleClass: 'btn-outline-danger ml-2',
      });
    }
  }

  ngOnInit(): void {
    if (!!this.route.snapshot.data && !!this.route.snapshot.data.config) {
      this.config = this.route.snapshot.data.config;
    }
  }

  public onLazyLoad(evt: LazyLoadEvent): void {
    super.onLazyLoad(evt);
    // this.loadingData = true;
    // this.dataSubject.next(evt);
  }

  public getDataProvider(evt: LazyLoadEvent, isExport?: boolean): Observable<IPagedList<T>> {
    return this.config.getDataProvider(evt);
  }
  public deleteEntity(item: T): Observable<any> {
    return this.config.deleteEntity(item);
  }
}

import { Component, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Subject, fromEvent, Observable, of, config } from 'rxjs';
import { DynamicFormControl } from '../../../@forms/@core/interfaces/dynamic-form-control';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ImportConfig } from '../../models/import.config';
import { TableColumn } from '@app/@ideo/components/table/models/table-column';
import { ButtonItem } from '@app/@ideo/core/models/button-item';
import { takeWhile, take } from 'rxjs/operators';
import { LazyLoadEvent } from '../../../@ideo/components/table/events/lazy-load.event';
import { TableComponent } from '../../../@ideo/components/table/table.component';
import { HttpClient } from '@angular/common/http';
import { FormDateComponent } from '../../../@forms/form-fields/form-date/form-date.component';
import { environment } from '@env/environment';
import { FormSwitchComponent } from '../../../@forms/form-fields/form-switch/form-switch.component';
import { FormTextComponent } from '@app/@forms/form-fields';

@Component({
  selector: 'prx-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
})
export class ImportComponent implements OnInit, OnDestroy {
  constructor(private bsModalRef: BsModalRef, private fb: FormBuilder, private http: HttpClient) {
    this.modalRef = bsModalRef;
  }

  private isAlive: boolean;
  @ViewChild('table', { static: false }) public table: TableComponent;
  public modalRef: BsModalRef;
  public onClose: Subject<boolean> = new Subject<boolean>();
  public loading$: EventEmitter<boolean> = new EventEmitter<boolean>();
  public file: File;
  public config: ImportConfig;
  public form: FormGroup;
  public items: any[];
  public items$: Observable<any[]>;
  public formControls: { [field: string]: DynamicFormControl } = {};
  public itemsActions: ButtonItem[] = [
    {
      icon: 'fas fa-edit',
      type: 'button',
      click: (item, evt) => {
        var index = this.items.indexOf(item);
        this.table.rowEdits[index] = !this.table.rowEdits[index];
        return false;
      },
    },
  ];

  ngOnInit(): void {
    this.isAlive = true;
    this.config.columns = this.config.columns.map((z) => {
      z.sortable = false;
      z.sortName = null;
      return z;
    });
    this.formControls = this.config.controls.reduce((prev, curr, i) => {
      curr.config.autoShowErrors = true;
      prev[curr.config.name] = curr;
      return prev;
    }, {});
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  public onConfirm(): void {
    let items = this.table?.items;
    let formValues = this.table?.form?.getRawValue();
    if (!!items?.length && !!formValues?.length) {
      for (let i = 0; i < formValues.length; i++) {
        if (!!Object.keys(formValues[i])?.length) {
          items[i] = formValues[i];
        }
      }
    }
    this.config
      .import(items)
      .pipe(take(1))
      .subscribe((res) => {
        this.onClose.next(true);
        this.modalRef.hide();
      });
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.modalRef.hide();
  }

  onSelect(args: NgxDropzoneChangeEvent): void {
    // onUploadInit
    if (!!args.addedFiles?.length) {
      this.file = args.addedFiles[0];

      var myFile = this.file;
      var reader = new FileReader();
      this.loading$.emit(true);
      fromEvent(reader, 'load')
        .pipe(takeWhile((x) => this.isAlive))
        .subscribe((e: ProgressEvent<FileReader>) => {
          let csvdata = e.target.result as string;
          let items = [];

          let newLinebrk = csvdata.split('\n');
          let header = newLinebrk[0].split(',');
          let headerLower = header.map((h) => h.toLowerCase());
          let controls = [...this.config.controls];
          for (let i = 1; i < newLinebrk.length; i++) {
            let columns = newLinebrk[i].split(',');
            let item = {};
            for (let z = 0; z < columns.length; z++) {
              let f = this.config.columns.find(
                (c) => headerLower[z].toLowerCase().trim() == c.field?.toLowerCase()?.trim()
              );
              let isBool =
                ['TRUE', 'FALSE'].some((x) => x?.toLowerCase() == columns[z]?.toLowerCase()?.trim()) ||
                !!controls.some(
                  (c) =>
                    c.config.name?.toLowerCase()?.trim() == headerLower[z].toLowerCase().trim() &&
                    c.type == FormSwitchComponent
                );
              let isDate: boolean = false;

              if (
                controls.find((c) => c.config.name == f?.field)?.type == FormDateComponent ||
                ['updated', 'created'].indexOf(f?.field?.toLowerCase()) >= 0
              ) {
                item[f.field] = new Date(columns[z].trim()).toISOString();
                item[f.field] = !!item[f.field] ? item[f.field] : null;
                isDate = true;
              } else {
                item[f?.field || 'id'] = isBool ? columns[z]?.toLowerCase()?.trim() == 'true' : columns[z].trim();
              }
              if (!!item[f?.field] && item[f?.field] == '') {
                item[f?.field] = !!columns[z].trim() ? columns[z].trim() : null;
              }

              if (
                !isDate &&
                !controls.find(
                  (c) =>
                    c.config.name == f?.field &&
                    c.type == FormTextComponent &&
                    (!c.config.data || c.config.data?.type != 'text')
                )
              ) {
                try {
                  let numeric = parseFloat(item[f?.field]);
                  if (!isNaN(numeric)) {
                    item[f?.field] = numeric;
                  }
                } catch (error) {}
              }

              if (!!f?.field && item[f?.field] == '') {
                item[f?.field] = null;
              }

              if (item['id'] == '') {
                item['id'] = null;
              }
            }
            if (Object.keys(item).some((z) => !!item[z])) {
              items.push(item);
            }
          }

          this.form = this.fb.group({
            items: this.fb.array(
              items.map((z) =>
                this.fb.group(
                  controls.map((c) => {
                    return { [c.config.name]: z[c.config.name] };
                  })
                )
              )
            ),
          });

          this.items$ = of(items);
          this.items = items;
          this.loading$.emit(false);
        });

      reader.readAsBinaryString(myFile);
    } else {
      this.file = null;
    }
  }

  public keys(obj: any): string[] {
    return Object.keys(obj);
  }

  public getForm(index: number): FormGroup {
    return (this.form.controls['items'] as FormArray).controls[index + ''] as FormGroup;
  }

  public lazy(evt: LazyLoadEvent) {}

  public downloadTemplate(evt: Event) {
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    evt.preventDefault();
    this.http
      .get(`${environment.serverUrl}/${this.config.downloadTemplate}?export=Csv`, { params: { export: 'Csv' } })
      .subscribe();
  }
}

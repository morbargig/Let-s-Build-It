import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { TemplatesService } from '../../templates.service';
import { BreadcrumType } from '../../../../../../blocks/navigations/breadcrum/breadcrum.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicFormControl } from '../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '../../../../../../@forms/form-fields/form-text/form-text.component';
import { FormEditorComponent } from '../../../../../../@forms/form-fields/form-editor/form-editor.component';
import { SelectItem } from '../../../../../../@ideo/components/table/models/select-item';
import { LocaleResourcesService } from '../../../../../configuration/modules/localization/locale-resource/locale-resources.service';
import { MAX_INT } from '../../../../../../@ideo/components/table/table.component';
import { Subject } from 'rxjs';
import { FieldEvent } from '../../../../../../@forms/@core/interfaces/events';
import { Location } from '@angular/common';
import { TemplateField } from '../../../../../../@shared/models/template.model';
import { FormEditor } from '../../../../../../@forms/form-fields/form-editor/form-editor';

@Component({
  selector: 'prx-template-value-editor',
  templateUrl: './template-value-editor.component.html',
  styleUrls: ['./template-value-editor.component.scss'],
})
export class TemplateValueEditorComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private templatesService: TemplatesService,
    private fb: FormBuilder,
    private localeResourcesService: LocaleResourcesService,
    private location: Location
  ) {}

  public breadcrumbs: BreadcrumType[] = [
    { label: 'Configuration' },
    { label: 'Templates', url: '../' },
    { label: 'Template' },
  ];

  public formInstance: FormGroup;
  public controls: DynamicFormControl[] = null;
  public localizationItems: SelectItem[];
  public templateFields: { title: string; items: SelectItem[] }[];
  private htmlAppender: Subject<FieldEvent> = new Subject<FieldEvent>();

  ngOnInit(): void {
    this.localeResourcesService
      .getAll({ page: 1, pageSize: MAX_INT })
      .pipe(take(1))
      .subscribe(
        (res) =>
          (this.localizationItems = res?.data?.map((r) => {
            return {
              label: r.value,
              value: r.name,
            } as SelectItem;
          }))
      );

    this.route.params.pipe(take(1)).subscribe((params) => {
      const templateId = params['id'];
      this.templatesService
        .get(templateId)
        .toPromise()
        .then((res) => {
          this.formInstance = this.fb.group({});

          this.templatesService
            .getFields(templateId)
            .toPromise()
            .then((items) => {
              this.templateFields = items?.map((v) => {
                return {
                  title: v.name,
                  items: v.fields.map((r) => {
                    return {
                      label: r.name,
                      value: `${v.name}.${r.name}`,
                      items: r.fields?.map((f) => {
                        return {
                          label: f.name,
                          value: `${v.name}.${r.name}.${f.name}`,
                        } as SelectItem;
                      }),
                    } as SelectItem;
                  }),
                };
              });

              this.controls = [
                {
                  type: FormEditorComponent,
                  config: {
                    name: 'body',
                    type: 'text',
                    placeholder: 'Enter Body',
                    styleClass: 'col-12',
                    setter: this.htmlAppender,
                    value: res.lastValue?.value,
                    data: {
                      tagsToolbar: this.templateFields,
                      localizationSource: (query: string) =>
                        this.localeResourcesService
                          .getAll({
                            page: 1,
                            pageSize: 50,
                            sortColumn: 'Name',
                            sortDirection: 'asc',
                            filters: !!query
                              ? {
                                  Value: {
                                    value: query,
                                    matchMode: 2250,
                                  },
                                  LanguageId: {
                                    value: 1,
                                    matchMode: 2000,
                                  },
                                }
                              : {
                                  LanguageId: {
                                    value: 1,
                                    matchMode: 2000,
                                  },
                                },
                          })
                          .pipe(
                            map((x) =>
                              x?.data?.map((d) => {
                                return {
                                  label: d.value,
                                  value: d.name,
                                } as SelectItem;
                              })
                            )
                          ),
                    } as FormEditor,
                  },
                },
                {
                  type: FormTextComponent,
                  config: {
                    name: 'templateId',
                    type: 'hidden',
                    value: res.id,
                  },
                },
              ];
            });
        });
    });
  }

  public localizationEntryClicked(evt: any) {
    this.htmlAppender.next({ type: 'onPatchValue', value: `{{${evt}}}` });
  }

  public submitForm(value: any) {
    this.templatesService
      .createTemplateValue(value.templateId, value.body)
      .toPromise()
      .then((res) => {
        this.location.back();
      });
  }
}

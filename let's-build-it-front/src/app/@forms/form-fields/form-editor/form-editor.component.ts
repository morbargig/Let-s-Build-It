import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { debounceTime, filter, switchMap, map, take } from 'rxjs/operators';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { FormEditor } from './form-editor';
import { fromEvent } from 'rxjs';
import { SelectItem } from '../../../@ideo/components/table/models/select-item';

@Component({
  selector: 'ideo-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormEditorComponent
  extends BaseFieldDirective<FormGroup>
  implements Field<FormEditor>, OnInit, AfterViewInit {
  public config: FieldConfig<FormEditor>;
  public group: FormGroup;
  public id: string;
  public html: string;
  public apiKey: string;
  public init: any = null;

  @ViewChild('editor', { static: true }) public editor: EditorComponent;

  constructor() {
    super();
    this.apiKey = environment.tinyMceApiKey;
  }

  ngOnInit(): void {
    if (!!this.config?.setter) {
      this.config.setter.pipe(filter((x) => x.type == 'onPatchValue')).subscribe((appendMe) => {
        this.editor.editor.insertContent(appendMe.value);
      });
    }
    if (!!this.config?.data?.tagsToolbar?.length || !!this.config?.data?.localizationSource) {
      this.init = {
        height: 500,
        relative_urls: true,
        document_base_url: '',
        menu: {
          tags: { title: 'Insert Tags', items: 'entities localization' },
        },
        toolbar: 'insert localizationsidebar preview',
        menubar: 'file edit view format tools tags',
        setup: (editor: any) => {
          if (!!this.config?.data?.tagsToolbar?.length) {
            editor.ui.registry.addMenuButton('insert', {
              icon: 'comment-add',
              fetch: (callback: Function) => {
                let items = this.config?.data?.tagsToolbar?.map((x) => {
                  return {
                    type: 'nestedmenuitem',
                    text: x.title,
                    icon: x.icon,
                    getSubmenuItems: () =>
                      x.items.map((z) => {
                        return !!z.items?.length
                          ? {
                              type: 'nestedmenuitem',
                              text: z.label,
                              icon: z.icon,
                              getSubmenuItems: () =>
                                z.items.map((e) => {
                                  return {
                                    type: 'menuitem',
                                    text: e.label,
                                    icon: e.icon,
                                    onAction: () => {
                                      editor.insertContent(`{{Entity:${e.value}}}`);
                                    },
                                  };
                                }),
                            }
                          : {
                              type: 'menuitem',
                              text: z.label,
                              icon: z.icon,
                              onAction: () => {
                                editor.insertContent(`{{Entity:${z.value}}}`);
                              },
                            };
                      }),
                  };
                });
                callback(items);
              },
            });
          }

          if (!!this.config?.data?.localizationSource) {
            editor.ui.registry.addSidebar('localizationsidebar', {
              tooltip: 'Insert Loclaized value',
              icon: 'translate',
              onSetup: (api: any) => {},
              onShow: (api: any) => {
                let element = api.element() as HTMLElement;
                if (!!element.querySelector('.localization-container')) {
                  return;
                }
                const container = document.createElement('form');
                container.classList.add('localization-container');
                container.classList.add('w-100');

                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = 'query';
                input.classList.add('form-control');

                const ul = document.createElement('ul');
                ul.classList.add('localization-list');

                const itemsBuilder = (res: SelectItem[]) => {
                  ul.innerHTML = '';
                  for (let i = 0; i < res.length; i++) {
                    const element = res[i];
                    const li = document.createElement('li');
                    li.setAttribute('data-key', element.value);
                    li.textContent = element.label;

                    fromEvent(li, 'click').subscribe((c) => editor.insertContent(`{{Localization:${element.value}}}`));

                    ul.appendChild(li);
                  }
                };

                fromEvent(input, 'keyup')
                  .pipe(
                    debounceTime(300),
                    switchMap((x) => this.config.data.localizationSource(input.value))
                  )
                  .subscribe((res) => itemsBuilder(res));

                this.config.data
                  .localizationSource(null)
                  .pipe(take(1))
                  .subscribe((res) => itemsBuilder(res));
                container.appendChild(input);
                container.appendChild(ul);
                element.appendChild(container);
                console.log('Render panel', api.element());
              },
              onHide: (api: any) => {
                console.log('Hide panel', api.element());
              },
            });
          }
        },
      };
    } else {
      this.init = {
        height: 500,
        relative_urls: true,
        document_base_url: '',
        toolbar: 'preview',
      };
    }
  }

  ngAfterViewInit(): void {}
}

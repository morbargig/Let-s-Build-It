import { Injectable } from '@angular/core';
import { IFormGenerator } from '../../../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../../../@forms/@core/interfaces/dynamic-form-control';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { LanguagesService } from '../../../localization/language/languages.service';
import { RolesService } from '../services/roles.service';
import { PageFormConfig } from '../../../../../../@shared/models/edit-form.config';
import { EMPTY, Subject } from 'rxjs';
import { RoleModel } from '../../../../../../@shared/models/role.model';
import { tap, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { FormTextComponent } from '../../../../../../@forms/form-fields/form-text/form-text.component';
import { Validators } from '@angular/forms';
import { FormSelectComponent } from '../../../../../../@forms/form-fields/form-select/form-select.component';
import { MAX_INT } from '../../../../../../@ideo/components/table/table.component';
import { SelectItem } from '../../../../../../@ideo/components/table/models/select-item';
@Injectable({
  providedIn: 'root',
})
export class RolesFormComponentResolverService
  implements IFormGenerator<DynamicFormControl[]>, Resolve<PageFormConfig> {
  constructor(
    private rolesService: RolesService,
    private languagesService: LanguagesService,
    private location: Location
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PageFormConfig {
    let isEdit = !!route.paramMap.get('id') && route.paramMap.get('id') != 'create';

    const titleEmitter: Subject<string> = new Subject<string>();
    const pageConfig = {
      title$: titleEmitter,
      breadcrumbs: [{ label: 'Security' }, { label: 'Roles', url: '../' }, { label: 'Role' }],
      groupConfig: {
        controls: this.generate(isEdit),
      },
      submit: (model: RoleModel) => {
        if (isEdit) {
          return this.rolesService.update(model.id, model);
        } else {
          return this.rolesService.create(model);
        }
      },
      getEntityById: (id) =>
        this.rolesService.get(id).pipe(
          tap((x) => {
            if (!!isEdit) {
              titleEmitter.next(`Edit '${x.name}'`);
            }
            return x;
          })
        ),
    } as PageFormConfig;

    return pageConfig;
  }

  generate(isEdit: boolean): DynamicFormControl[] {
    let form: DynamicFormControl[] = [];

    form.push(
      {
        type: FormTextComponent,
        config: {
          name: 'name',
          type: 'text',
          label: 'Role Name',
          placeholder: 'Enter Role Name',
          styleClass: 'col-4',
          validation: [Validators.required, Validators.maxLength(20), Validators.minLength(3)],
          errorMessages: {
            required: 'Locale Resource is required',
            maxlength: 'Role Name exceeds the maximum length',
            minlength: 'Role Name is too short',
          },
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'parentRoleId',
          label: 'Parent Role',
          placeholder: 'Parent Role',
          styleClass: 'col-4',
          optionsArr$: this.rolesService
            .getAll({ page: 1, pageSize: MAX_INT, sortColumn: 'Name', sortDirection: 'asc' })
            .pipe(
              map((r) =>
                r?.data?.map((d) => {
                  return {
                    label: d.name,
                    value: d.id,
                  } as SelectItem;
                })
              )
            ),
          errorMessages: {
            required: 'Locale Resource is required',
            maxlength: 'Role Name exceeds the maximum length',
            minlength: 'Role Name is too short',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
          type: 'hidden',
        },
      }
    );

    return form;
  }
}

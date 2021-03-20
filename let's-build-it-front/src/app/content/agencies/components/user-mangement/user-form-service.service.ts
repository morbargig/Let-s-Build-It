import { Injectable } from '@angular/core';
import { IFormGenerator, ModelConverter } from '../../../../@forms/@core/models/form-generator';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { FormFileComponent } from '../../../../@forms/form-fields/form-file/form-file.component';
import { Validators } from '@angular/forms';
import { SelectItem } from '../../../../@forms/@core/interfaces';
import { FormFile } from '../../../../@forms/form-fields/form-file/form-file';
import { AccountService } from '../../../../@shared/services/account.service';
import { FormSelectComponent } from '../../../../@forms/form-fields/form-select/form-select.component';
import { FormTextComponent } from '../../../../@forms/form-fields/form-text/form-text.component';
import { map } from 'rxjs/operators';
import { IdeoValidators } from '../../../../@forms/@core/validators/ideo.validators';
import { IdeoRegexService } from '../../../../@ideo/infrastructure/services/ideo-regex.service';

@Injectable({
  providedIn: 'root',
})
export class UserFormService implements IFormGenerator<DynamicFormControl[]> {
  constructor(private accountService: AccountService) {}

  private _unwantedRoles: string[] = ['Customer', 'CarOwner', 'Admin'];
  public get unwantedRoles(): string[] {
    return this._unwantedRoles;
  }
  public set unwantedRoles(v: string[]) {
    this._unwantedRoles = v;
  }

  generate(...params: any[]): DynamicFormControl[] {
    return [
      {
        type: FormFileComponent,
        config: {
          name: 'profileImageId',
          label: 'User Image',
          value: params?.[0]?.profileImageId,
          styleClass: 'col-6',
          data: {
            autoUpload: true,
          } as FormFile,
        },
      },
      {
        type: FormSelectComponent,
        config: {
          name: 'role',
          label: 'Role',
          placeholder: 'Select Roles',
          styleClass: 'col-12 col-md-6',
          validation: [Validators.required],
          optionsArr$: this.accountService.getRoles().pipe(
            map((r) =>
              r
                .filter((z) => this.unwantedRoles.indexOf(z.name) < 0)
                .map((role) => {
                  return {
                    label: role.name,
                    value: role.name,
                  } as SelectItem;
                })
            )
          ),
          errorMessages: {
            required: 'Role is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'firstName',
          type: 'text',
          label: 'First name',
          value: params?.[0]?.firstName,
          placeholder: 'Enter First name',
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'First name is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'lastName',
          type: 'text',
          label: 'Last name',
          value: params?.[0]?.lastName,
          placeholder: 'Enter Last name',
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Last name is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'birthDate',
          label: 'Birth Date',
          value: null, //TODO: fill filed when add to user json data
          type: 'datetime-local',
          placeholder: 'Enter Birth Date',
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Birth Date is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'email',
          type: 'text',
          label: 'Email',
          value: params?.[0]?.email,
          placeholder: 'Enter Email',
          styleClass: 'col-6',
          validation: [Validators.required, Validators.email],
          errorMessages: {
            required: 'Email is required',
            email: 'invalid email address',
          },
        },
      },
      // {
      //   type: FormTextComponent,
      //   config: {
      //     name: 'tags',
      //     label: 'Tags',
      //     value: null, //TODO: fill filed when add to user json data
      //     type: 'text',
      //     placeholder: 'Add tags',
      //     styleClass: 'col-6',
      //     validation: [],
      //     errorMessages: {},
      //   },
      // },
      {
        type: FormTextComponent,
        config: {
          name: 'phoneNumber',
          label: 'Phone',
          value: params?.[0]?.phoneNumber, //TODO: fill filed when add to user json data
          type: 'text',
          placeholder: 'Phone',
          styleClass: 'col-6',
          validation: [Validators.required],
          errorMessages: {
            required: 'Phone is required',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'password',
          label: 'Password (temporary)',
          value: '',
          type: 'password',
          placeholder: 'Password (temporary)',
          styleClass: 'col-6',
          validation: [
            Validators.required,
            Validators.pattern(IdeoRegexService.strongPassword),
            Validators.minLength(10),
          ],
          errorMessages: {
            required: 'Password is required',
            pattern: 'Use a mix of letters, numbers & symbols',
            minlength: 'The password must be between 10 and 20 characters',
          },
        },
      },
      // {
      //   type: FormTextComponent,
      //   config: {
      //     name: 'address',
      //     label: 'Address',
      //     value: null, //TODO: fill filed when add to user json data
      //     type: 'text',
      //     placeholder: 'Address',
      //     styleClass: 'col-12',
      //     validation: [],
      //     errorMessages: {},
      //   },
      // },
    ];
  }
  convert?: ModelConverter<DynamicFormControl[], any>;
}

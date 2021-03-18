import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { debounceTime, map, tap } from 'rxjs/operators';
import { IFormGenerator } from '../../../../@forms/@core/models/form-generator';
import { AccountService } from '../../../../@shared/services/account.service';
import { FieldEvent, SelectItem } from '../../../../@forms/@core/interfaces';
import { FormTextComponent } from '../../../../@forms/form-fields/form-text/form-text.component';
import { Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { FormSwitchComponent } from '@app/@forms/form-fields';
import { Location } from '@angular/common';
import { FormMultiselectComponent } from '../../../../@forms/form-fields/form-multiselect/form-multiselect.component';
import { WizardFormConfig } from '@app/@shared/models/wizard-form.config';
import { DynamicSteppedForm, SteppedFormMode } from '@app/@forms/@core/interfaces/dynamic-stepped-form';
import { FormFileComponent } from '../../../../@forms/form-fields/form-file/form-file.component';
import { FilesService } from '../../../../@forms/@core/services/files.service';
import { FormFile } from '../../../../@forms/form-fields/form-file/form-file';
import { FormDateComponent } from '../../../../@forms/form-fields/form-date/form-date.component';
import { IdeoValidators } from '../../../../@forms/@core/validators/ideo.validators';
import { FormSelectComponent } from '../../../../@forms/form-fields/form-select/form-select.component';
import { UserModel } from '../../../../@shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserFormComponentResolverService
  implements IFormGenerator<DynamicSteppedForm[]>, Resolve<WizardFormConfig> {
  constructor(
    private service: UsersService,
    private accountService: AccountService,
    private location: Location,
    private fb: FormBuilder
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): WizardFormConfig {
    let isEdit = route.paramMap.get('id') != 'create';

    const titleEmitter: Subject<string> = new Subject<string>();
    const pageConfig = {
      title$: titleEmitter,
      breadcrumbs: [{ label: 'Users', url: '../' }, { label: 'User' }],
      arrayConfig: {
        controls: this.generate(isEdit),
      },
      submit: (model: any) => {
        if (isEdit) {
          return this.service.update(model[0].id, model);
        } else {
          if (model?.forms[0].roles == 'Customer') {
            let creditCardExpiration = model?.forms[2].creditCardExpiration.split('-');
            let request = {
              generalInformation: {
                userName: model?.forms[0].userName,
                email: model?.forms[0].email,
                role: model?.forms[0].roles,
                password: 'Aa123456890!',
                phoneNumber: '0503155577',
              },
              personalInformation: {
                birthDate: model?.forms[1].birthDate,
                firstName: model?.forms[1].firstName,
                lastName: model?.forms[1].lastName,
                teudatZehut: model?.forms[1].teudatZehut,
              },
              creditDetails: {
                creditCardExpiration: new Date(creditCardExpiration[0], creditCardExpiration[1], 1),
                creditCardHolder: model?.forms[2].creditCardHolder,
                creditCardHolderIdentity: model?.forms[2].creditCardHolderIdentity,
                creditCardNumber: model?.forms[2].creditCardNumber,
              },
              licence: {
                backImageId: model?.forms[4].backImageId[0].id,
                frontImageId: model?.forms[4].frontImageId[0].id,
              },
            };
            return this.service.createCustomer(request);
          }
        }
      },
      getEntityById: (id) =>
        this.service.get(id).pipe(
          tap((x) => {
            if (!!isEdit) {
              titleEmitter.next(`Edit ${x.userName}`);
            }
            return x;
          })
        ),
      toForm: (entity: UserModel) => {
        return {
          generalInformation: this.fb.group({
            userName: '',
          }),
        };
        return null;
      },
    } as WizardFormConfig;

    return pageConfig;
  }

  generate(isEdit: boolean): DynamicSteppedForm[] {
    let form: DynamicSteppedForm[] = [];
    const isActiveSetter: Subject<FieldEvent> = new Subject<FieldEvent>();
    form.push({
      title: 'General Information',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormTextComponent,
          config: {
            name: 'userName',
            type: 'text',
            label: 'User Name',
            placeholder: 'Enter User Name',
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required],
            errorMessages: {
              required: 'User Name is required',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'email',
            type: 'text',
            label: 'Email',
            placeholder: 'Enter Email',
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required, Validators.email],
            errorMessages: {
              required: 'Email is required',
              email: 'invalid email address',
            },
          },
        },

        {
          type: FormSelectComponent,
          config: {
            name: 'roles',
            label: 'Roles',
            placeholder: 'Select Roles',
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required],
            registerControl: (ctrl) => {
              ctrl.valueChanges.pipe(debounceTime(100)).subscribe((val) => {
                if ((!!val && val == 'Customer') || val[0] == 'Customer') {
                  let steps = this.appendCustomerSteps();
                  for (let r = 0; r < steps.length; r++) {
                    form.push(steps[r]);
                  }
                } else {
                  form.splice(1);
                }
                setTimeout(() => {
                  form = [...form];
                }, 0);
              });
            },
            optionsArr$: this.accountService.getRoles().pipe(
              map((r) =>
                r.map((role) => {
                  return {
                    label: role.name,
                    value: role.name,
                  } as SelectItem;
                })
              )
            ),
            errorMessages: {
              required: 'Roles is required',
            },
          },
        },
        {
          type: FormSwitchComponent,
          config: {
            name: 'isActive',
            type: 'text',
            label: 'Is Active',
            styleClass: 'col-12 col-md-6',
            setter: isActiveSetter,
          },
        },
        {
          type: FormFileComponent,
          config: {
            name: 'profileImageId',
            label: 'Avatar',
            styleClass: 'col-12 col-md-6',
            data: {
              autoUpload: true,
            } as FormFile,
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'id',
            type: 'hidden',
          },
        },
      ],
    });

    if (!isEdit) {
      setTimeout(() => {
        isActiveSetter.next({ type: 'setValue', value: true });
      }, 0);
    }

    return form;
  }

  appendCustomerSteps() {
    let form: DynamicSteppedForm[] = [];
    form.push({
      title: 'Personal Information',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormTextComponent,
          config: {
            name: 'firstName',
            type: 'text',
            label: 'First name',
            placeholder: 'Enter First name',
            styleClass: 'col-12 col-md-6',
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
            placeholder: 'Enter Last name',
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required],
            errorMessages: {
              required: 'Last name is required',
            },
          },
        },
        {
          type: FormDateComponent,
          config: {
            name: 'birthDate',
            label: 'Birth Date',
            type: 'datetime-local',
            placeholder: 'Enter Birth Date',
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required],
            errorMessages: {
              required: 'Birth Date is required',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'teudatZehut',
            type: 'tel',
            label: 'Teudat Zehut',
            placeholder: 'Enter Teudat Zehut',
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required, IdeoValidators.israelIdentity()],
            errorMessages: {
              required: 'Teudat Zehut is required',
              israelIdentity: 'please enter valid Isreali Identity number.',
            },
          },
        },
      ],
    });

    form.push({
      title: 'Credit Details',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormTextComponent,
          config: {
            name: 'creditCardNumber',
            type: 'tel',
            label: 'Credit Card Number',
            placeholder: 'Credit Card Number',
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required, IdeoValidators.creditCard()],
            errorMessages: {
              required: 'Credit Card Number is required',
              creditcard: 'please enter valid Credit Card number.',
            },
          },
        },
        {
          type: FormDateComponent,
          config: {
            name: 'creditCardExpiration',
            type: 'month',
            label: 'Credit Card Expiration',
            placeholder: 'Credit Card Expiration',
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required, IdeoValidators.greaterThanToday()],
            errorMessages: {
              required: 'Credit Card Expiration is required',
              greaterThanToday: 'invalid Credit Card Expiration date',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'creditCardHolder',
            type: 'tel',
            label: 'Credit Card Holder Name',
            placeholder: 'Credit Card Holder Name',
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required],
            errorMessages: {
              required: 'Credit Card Holder Name is required',
            },
          },
        },
        {
          type: FormTextComponent,
          config: {
            name: 'creditCardHolderIdentity',
            type: 'tel',
            label: 'Credit Card Holder Identity',
            placeholder: 'Enter Credit Card Holder Identity',
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required, IdeoValidators.israelIdentity()],
            errorMessages: {
              required: 'Credit Card Holder Identity is required',
              israelIdentity: 'please enter valid Isreali Identity number.',
            },
          },
        },
      ],
    });

    form.push({
      title: 'Subscription',
      mode: SteppedFormMode.Tabbed,
      group: [],
    });

    form.push({
      title: 'License',
      mode: SteppedFormMode.Tabbed,
      group: [
        {
          type: FormFileComponent,
          config: {
            name: 'frontImageId',
            label: 'Front Image',
            data: {
              autoUpload: true,
            } as FormFile,
            styleClass: 'col-12 col-md-6',
            validation: [Validators.required],
            errorMessages: {
              required: 'Licence Front Image is required.',
            },
          },
        },
        {
          type: FormFileComponent,
          config: {
            name: 'backImageId',
            label: 'Back Image',
            styleClass: 'col-12 col-md-6',
            data: {
              autoUpload: true,
            } as FormFile,
            validation: [Validators.required],
            errorMessages: {
              required: 'Licence Back Image is required.',
            },
          },
        },
      ],
    });

    return form;
  }
}

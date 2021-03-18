import { Component, OnInit } from '@angular/core';
import { SelectItem } from '../../../../../@ideo/components/table/models/select-item';
import { FormGroup, Validators } from '@angular/forms';
import { DynamicFormControl } from '../../../../../@forms/@core/interfaces/dynamic-form-control';
import { SideBarPageService } from '../../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { FormTextComponent } from '../../../../../@forms/form-fields/form-text/form-text.component';
import { UserModel } from '../../../../../@shared/models/user.model';
import { IdeoValidators } from '../../../../../@forms/@core/validators/ideo.validators';

@Component({
  selector: 'prx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public get user(): UserModel { return this.sidebarService.entity }
  public profileForm: FormGroup;
  public profileControls: DynamicFormControl[] = [
    {
      type: FormTextComponent,
      config: {
        name: 'firstName',
        placeholder: 'First Name',
        value: this.user?.firstName,
        type: 'text',
        label: 'First Name',
        styleClass: 'col-4',
        validation: [Validators.required],
        errorMessages: {
          required: 'First Name is required',
        },
      }
    }, {
      type: FormTextComponent,
      config: {
        name: 'email',
        placeholder: 'Email',
        value: this.user?.email,
        type: 'text',
        label: 'Email',
        styleClass: 'col-4',
        validation: [Validators.required, Validators.email],
        errorMessages: {
          required: 'Email is required',
        },
      }
    }, {
      type: FormTextComponent,
      config: {
        name: 'identityNumber',
        placeholder: "Identity Number",
        type: 'number',
        label: 'Identity Number',

        value: this.user?.teudatZehut,
        styleClass: 'col-4',
        validation: [IdeoValidators.israelIdentity],
        errorMessages: {
          required: 'Identity Number is required',
        },
      }
    },
    {
      type: FormTextComponent,
      config: {
        name: 'lastName',
        placeholder: "Last Name",
        type: 'text',
        label: 'Last Name',
        value: this.user?.lastName,
        styleClass: 'col-4',
        validation: [Validators.required],
        errorMessages: {
          required: 'Last Name is required',
        },
      }
    },
    {
      type: FormTextComponent,
      config: {
        name: 'userName',
        placeholder: "User Name",
        type: 'text',
        label: 'User Name',
        value: this.user?.userName,
        styleClass: 'col-4',
        validation: [Validators.required],
        errorMessages: {
          required: 'User Name is required',
        },
      }
    },
    {
      type: FormTextComponent,
      config: {
        name: 'phone',
        placeholder: "Phone Number",
        type: 'tel',
        value: null, // TODO fill with real data
        label: 'Phone Number',
        styleClass: 'col-4',
        validation: [],
        errorMessages: {
          required: 'Phone Number is required',
        },
      }
    },
    {
      type: FormTextComponent,
      config: {
        name: 'birthday',
        placeholder: "Birthday",
        value: null, // TODO fill with real data
        type: 'date',
        label: 'Birthday',
        styleClass: 'col-4',
        validation: [IdeoValidators.olderThan(18)],
        errorMessages: {
          required: 'Birthday is required',
          olderThan: 'Birthday must be older than 18 year'
        },
      }
    },
    {
      type: FormTextComponent,
      config: {
        name: 'address',
        placeholder: "Address",
        value: null, // TODO fill with real data
        type: 'date',
        data: {
          rows: 4
        },
        label: 'Address',
        styleClass: 'col-4',
        validation: [],
        errorMessages: {
          required: 'Address is required',
        },
      }
    },
  ];

  constructor(private sidebarService: SideBarPageService) {
    this.sidebarService.breadcrumbs = [
      { label: 'User Management', url: '../../' },
      { label: this.user.fullName },
    ]
  }

  ngOnInit(): void {
    this.profileControls.patchValue(this.user)
  }
}

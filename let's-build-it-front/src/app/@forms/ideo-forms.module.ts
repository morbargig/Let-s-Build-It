import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormGroupComponent } from './@core/components/dynamic-form-group/dynamic-form-group.component';
import { DynamicFormControlComponent } from './@core/components/dynamic-form-control/dynamic-form-control.component';
import { ValidationMessagesComponent } from './@core/components/validation-messages/validation-messages.component';
import { DynamicFieldDirective } from './@core/directives/dynamic-field.directive';
import { BaseFieldDirective } from './@core/directives/base-field.directive';
import { HasErrorPipe } from './@core/pipes/has-error.pipe';
import { NotHiddenPipe } from './@core/pipes/not-hidden.pipe';
import { IsArrayControlPipe } from './@core/pipes/is-array-control.pipe';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '../@ideo/components/button/button.module';
import { TableModule } from '../@ideo/components/table/table.module';
import { SelectModule } from '../@ideo/components/select/select.module';
import { CheckboxModule } from '../@ideo/components/checkbox/checkbox.module';
import { MultiselectModule } from '../@ideo/components/multiselect/multiselect.module';
import { CalendarModule } from '../@ideo/components/calendar/calendar.module';
import { AutocompleteModule } from '../@ideo/components/autocomplete/autocomplete.module';
import {
  FormTextComponent,
  FormArrayComponent,
  FormAutoCompleteComponent,
  FormButtonComponent,
  FormCheckboxComponent,
  FormDateComponent,
  FormEditorComponent,
  // FormFileComponent
  FormGroupComponent,
  FormMultiselectComponent,
  FormNgbCheckboxButtonComponent,
  FormNgbRadioButtonsComponent,
  FormRadioComponent,
  FormSelectComponent,
  FormSubTextComponent,
  FormSwitchComponent,
  FormSwitcherComponent,
  FormTableComponent,
  FormTagsComponent,
} from './form-fields/index';
import { DynamicSteppedFormComponent } from './@core/components/dynamic-stepped-form/dynamic-stepped-form.component';
import { FormStepperComponent } from './@core/components/form-stepper/form-stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { FormFileComponent } from './form-fields/form-file/form-file.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

const EXPORTED = [DynamicFormGroupComponent, DynamicFormControlComponent, DynamicSteppedFormComponent];
const PIPES = [HasErrorPipe, NotHiddenPipe, IsArrayControlPipe];
const DIRECTIVES = [DynamicFieldDirective];
const COMPONENTS = [ValidationMessagesComponent];
const FIELDS = [
  FormTextComponent,
  FormArrayComponent,
  FormAutoCompleteComponent,
  FormButtonComponent,
  FormCheckboxComponent,
  FormDateComponent,
  FormEditorComponent,
  FormFileComponent,
  FormGroupComponent,
  FormMultiselectComponent,
  FormNgbCheckboxButtonComponent,
  FormNgbRadioButtonsComponent,
  FormRadioComponent,
  FormSelectComponent,
  FormSubTextComponent,
  FormSwitchComponent,
  FormSwitcherComponent,
  FormTableComponent,
  FormTagsComponent,
];

@NgModule({
  declarations: [...PIPES, ...DIRECTIVES, ...COMPONENTS, ...EXPORTED, ...FIELDS, FormStepperComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CdkStepperModule,
    ButtonModule,
    BsDropdownModule,
    // TableModule,
    SelectModule,
    CheckboxModule,
    MultiselectModule,
    CalendarModule,
    AutocompleteModule,
    EditorModule,
  ],
  exports: [...EXPORTED, ...FIELDS],
})
export class IdeoFormsModule {}

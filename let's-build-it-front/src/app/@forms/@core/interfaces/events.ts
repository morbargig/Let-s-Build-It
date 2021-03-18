export interface FieldEvent {
  type: 'setValue' | 'setDisabled' | 'setVisibility' | 'onPatchValue' | 'requiredSetter' | 'customEvent';
  value: any | any[];
}

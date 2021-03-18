import { Observable, timer, of } from 'rxjs';
import {
  FormGroup,
  ValidatorFn,
  FormControl,
  FormArray,
  AsyncValidatorFn,
  ValidationErrors,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';

export class IdeoValidators {
  public static groupValidations(getErrorNames: (values: any) => string): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } => {
      let errorName = getErrorNames((group as FormGroup).getRawValue());
      return !errorName
        ? null
        : {
          [errorName]: {
            valid: false,
          },
        };
    };
  }

  public static controlValidations(getErrorNames: (value: any) => string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let errorName = getErrorNames(control.value);
      return !errorName
        ? null
        : {
          [errorName]: {
            valid: false,
          },
        };
    };
  }

  public static requiredIfOtherFieldValid(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let otherControl = control.parent && control.parent.controls[controlName];
      return !!otherControl && !!otherControl.valid
        ? null
        : {
          [controlName]: {
            valid: false,
          },
        };
    };
  }

  public static requiredIfOtherFieldTrue(controlName: string, dependantControlNames: string[]): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!group) {
        return null;
      }
      let otherControl = (group as FormGroup).controls[controlName];
      if (!!otherControl && !!otherControl.value) {
        let valid: boolean = true;
        var dict = {};

        for (let i = 0; i < dependantControlNames.length; i++) {
          const name = dependantControlNames[i];
          let control = (group as FormGroup).controls[name];
          if (!!control) {
            control.setValidators([Validators.required]);
            valid = !!valid && !!control.value;
            if (!control.value) {
              dict[name] = { valid: !!control.value };
            }
          }
        }
        return !valid ? dict : null;
      } else if (!!otherControl) {
        for (let i = 0; i < dependantControlNames.length; i++) {
          const name = dependantControlNames[i];
          let control = (group as FormGroup).controls[name];
          if (!!control) {
            control.clearValidators();
          }
        }
      }

      return null;
    };
  }

  public static greaterThanOrEquals(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!!control?.parent) {
        let otherControl = control.parent.controls[controlName] as AbstractControl;
        if (!!otherControl) {
          const current = parseFloat(control?.value || '0');
          const other = parseFloat(otherControl?.value || '0');
          let inValid = current <= other;
          if (inValid) {
            setTimeout(() => {
              otherControl.updateValueAndValidity({ onlySelf: false, emitEvent: true });
            });
          }
          return inValid
            ? {
              [controlName]: {
                valid: false,
              }
            } : null
        }
      }
      return null;
    };
  }

  public static smallerThanOrEquals(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!!control?.parent) {
        let otherControl: AbstractControl = control.parent.controls[controlName];
        if (!!otherControl) {
          const current = parseFloat(control?.value || '0');
          const other = parseFloat(otherControl?.value || '0');
          let inValid = current >= other;
          if (inValid) {
            setTimeout(() => {
              otherControl.updateValueAndValidity({ onlySelf: false, emitEvent: true });
            });
          }


          return inValid
            ? {
              [controlName]: {
                valid: false,
              }
            } : null
        }
      }
      return null;
    };
  }

  public static israelIdentity(): ValidatorFn {
    const validation = (id: string) => {
      if (isNaN(Number(id))) {
        return false;
      }
      let strId = id.trim();
      if (strId.length > 9) {
        return false;
      }
      if (strId.length < 9) {
        while (strId.length < 9) strId = '0' + strId;
      }
      let counter = 0,
        rawVal,
        actualVal;
      for (let i = 0; i < strId.length; i++) {
        rawVal = Number(strId[i]) * ((i % 2) + 1);
        actualVal = rawVal > 9 ? rawVal - 9 : rawVal;
        counter += actualVal;
      }
      return counter % 10 === 0;
    };
    return (control: AbstractControl): { [key: string]: any } => {
      let tz = control?.value;
      if (!!tz) {
        let valid = validation(tz);
        if (!valid) {
          return {
            israelIdentity: true,
          };
        }
      }
      return null;
    };
  }

  public static creditCard(): ValidatorFn {
    const validation = (cardNo: string) => {
      if (isNaN(Number(cardNo))) {
        return false;
      }
      var s = 0;
      var doubleDigit = false;
      for (var i = cardNo.length - 1; i >= 0; i--) {
        var digit = +cardNo[i];
        if (doubleDigit) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        s += digit;
        doubleDigit = !doubleDigit;
      }
      return s % 10 == 0;
    };
    return (control: AbstractControl): { [key: string]: any } => {
      let tz = control?.value;
      if (!!tz) {
        let valid = validation(tz);
        if (!valid) {
          return {
            creditcard: true,
          };
        }
      }
      return null;
    };
  }

  public static olderThan(age: number): ValidatorFn {
    const validation = (value: string) => {
      var from = value.split('-'); // DD MM YYYY
      var year = Number(from[0]);
      var mydate = new Date();

      if (mydate.getFullYear() - year > age) {
        return true;
      } else {
        return false;
      }
    };
    return (control: AbstractControl): { [key: string]: any } => {
      let tz = control?.value;
      if (!!tz) {
        let valid = validation(tz);
        if (!valid) {
          return {
            olderThan: true,
          };
        }
      }
      return null;
    };
  }

  public static greaterThanToday(): ValidatorFn {
    const validation = (value: string) => {
      var from = value.split('-'); // DD MM YYYY

      var day = 1;
      var month = Number(from[1]);
      var year = Number(from[0]);
      var mydate = new Date();
      mydate.setFullYear(year, month - 1, day);

      var currdate = new Date();
      var setDate = new Date();

      setDate.setFullYear(mydate.getFullYear(), month - 1, 1);

      if (setDate > currdate) {
        return true;
      } else {
        return false;
      }
    };
    return (control: AbstractControl): { [key: string]: any } => {
      let tz = control?.value;
      if (!!tz) {
        let valid = validation(tz);
        if (!valid) {
          return {
            greaterThanToday: true,
          };
        }
      }
      return null;
    };
  }

  public static serverValidation(
    service: any,
    action: string,
    key: string,
    formFields: Function = null
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(350).pipe(
        switchMap(() => {
          let actionParams = [];
          if (!!formFields) {
            actionParams = formFields(control);
          }
          return service[action](control.value, ...actionParams).pipe(
            map((valid) => {
              let validate = null;
              if (!valid) {
                validate = {};
                validate[key] = true;
              }
              return validate;
            })
          );
        })
      );
    };
  }

  // public static uniqueFields(fields: string[]): ValidatorFn {
  //     return (formArr: FormArray)
  // }

  // public static isDate(s): ValidatorFn {
  //     if(isNaN(s) && !isNaN(Date.parse(s)))
  //         return null;
  // }
}

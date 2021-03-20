import { FormGroup } from '@angular/forms';

export class FormFile {
  constructor(obj: FormFile = null) {
    if (!!obj) {
      Object.keys(obj).forEach((key) => (this[key] = obj[key]));
    }
  }
  public autoUpload: boolean = false;
  public getTemplateUrl?: (form: FormGroup) => string;
  public newStyle: boolean = false;
  public title: string = 'Click here';
  public subTile: string = 'to upload an image';
  public multiple: boolean = false;
}

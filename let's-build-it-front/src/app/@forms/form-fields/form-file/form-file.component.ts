import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { BaseFieldDirective } from '../../@core/directives/base-field.directive';
import { Field, FieldConfig } from '../../@core/interfaces';
import { FormFile } from './form-file';
import { FormGroup } from '@angular/forms';
import { FilesService } from '../../@core/services/files.service';
import { environment } from '@env/environment';
import { ButtonItem } from '../../../@ideo/core/models/button-item';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ideo-form-file',
  templateUrl: './form-file.component.html',
  styleUrls: ['./form-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFileComponent extends BaseFieldDirective implements Field<FormFile>, OnInit {
  public config: FieldConfig<FormFile>;
  public group: FormGroup;
  public id: string;
  public uploadImageId: any[];
  public buttons: ButtonItem[] = [
    {
      label: 'Delete',
      icon: faTrash,
      click: (id) => {
        this.uploadImageId = this.uploadImageId.filter((i: number) => i !== id)
        this.removeFile()
        this.cd.markForCheck();
      },
    },
  ];


  public get label(): string {
    let fileName = 'Choose file';
    if (!!this.control.value && !!this.control.value.length) {
      if (this.control.value instanceof FileList) {
        fileName = this.control.value.item ? this.control.value.item(0)?.name : fileName;
      } else {
        fileName = this.control.value?.[0].url;
      }
    }
    return fileName;
    //return !!this.control.value?.length  ? (this.control.value as FileList).item(0).name : 'Choose file';
    // return !!this.control.value?.length  ? (this.control.value as FileList)[0].name : 'Choose file';

    // let label = (!!this.control.value && !!this.control.value.length) ?
    //  (!!(this.control.value as FileList) && (this.control.value as FileList).item? (this.control.value as FileList).item(0)?.name : 'Choose file') :'Choose file';
    // return label;
  }

  constructor(private fileService: FilesService, private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeWhile(r => this.isAlive)).subscribe((val) => {
      if (!!val) {
        let id
        if (typeof val === 'number') {
          id = val
        }
        else if (typeof val === 'object') id = [val?.[0]?.id | val?.[0]]
        if (this.config.data.multiple) {
          this.uploadImageId.push(id)
        } else {
          this.uploadImageId = [id]
        }
      }
      this.cd.markForCheck();
    });
    this.buttons = [...this.buttons, ...this.config?.data?.multiple ? [{}] : [null]].filter(i => !!i)
    this.cd.markForCheck();
    // TODO: need to fill here dynamic button to assign the image to another label by type enum loop
  }

  public fileUploaded(files: FileList) {
    this.control.setValue(files);
    if (this.config.onChange) {
      this.config.onChange(files, this.control);
    }
    if (!!files) {
      if (!!this.config?.data?.autoUpload) {
        this.fileService
          .uploadFile(files.item(0))
          .toPromise()
          .then((res) => {
            if (this.config.data.multiple) {
              this.uploadImageId.push(res.id)
            } else {
              this.uploadImageId = [res.id]
            }
            // let newValue = this.control.value
            // newValue.id = res.id
            // this.control.setValue([newValue]);
            this.control.setValue([res.id]);
            this.cd.markForCheck();
          });
      }
    }
    else {
      if (this.config.data.multiple) {
        this.uploadImageId.push(null)
      } else {
        this.uploadImageId = []
      }
      this.control.value ? this.control.value[0] = [] : null
      this.cd.markForCheck();
    }
  }

  public downloadTemplate() {
    let templateUrl = this.config.data.getTemplateUrl(this.group);
    if (!!templateUrl) {
      this.fileService.downloadFile(templateUrl, 'Template');
    }
  }

  public imageIdPipe(imageId: number | string, thumbnail: boolean = true) {
    if (!isNaN(+imageId)) {
      return `${environment.serverUrl}/api/Media/${!!thumbnail ? 'GetThumbnail/' : ''}${imageId}`;
    }
  }

  public removeFile() {
    this.fileUploaded(null);
  }

  public iconClass(icon: IconDefinition | string | false): string | false {
    if (!icon) return ''
    if (typeof icon !== 'string') {
      let res = (icon.prefix + ' fa-' + icon.iconName)
      return res
    }
    return icon
  }
}

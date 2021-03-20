import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { DynamicFormControl } from '@app/@forms/@core/interfaces/dynamic-form-control';
import { FormTextComponent } from '@app/@forms/form-fields';
import { NotificationsService } from '@app/@ideo/components/notifications/notifications.service';
import { PartnerModel } from '@app/@shared/models/partner.model';
import { PartnerProfileService } from '../../partner-profile.service';
import { PartnersService } from '../../partners.service';
import { WsiCardComponent } from '../../../../@shared/components/wsi-card/wsi-card.component';
import { PartnerDocumentType } from '@app/@shared/models/partner-media.model';
import { ButtonItem } from '../../../../@ideo/core/models/button-item';
import { SideBarPageService } from '@app/@shared/components/side-bar-page/isidibar-service.interface';
import { SettingsService } from '../../../configuration/modules/settings/settings.service';
import { FormSelectComponent } from '../../../../@forms/form-fields/form-select/form-select.component';
import { FormCheckboxComponent } from '../../../../@forms/form-fields/form-checkbox/form-checkbox.component';
import { SelectItem } from '@app/@forms/@core/interfaces';
import { PartnerMediaModel } from '../../../../@shared/models/partner-media.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FullScreenModalComponent } from '@app/@shared/components/full-screen-modal/full-screen-modal.component';
import { faExpand, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'prx-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  constructor(
    private modalService: BsModalService,
    private sidebarService: SideBarPageService,
    private partnersService: PartnersService,
    protected notificationsService: NotificationsService
  ) {
    this.sidebarService.breadcrumbs = [
      { label: 'Agencies', url: '../../' },
      { label: this.sidebarService.entity.name, url: './' },
      { label: 'General' },
    ];
  }

  public get partner(): PartnerModel {
    return this.sidebarService.entity;
  }
  public set partner(partner: PartnerModel) {
    this.sidebarService.entity = partner;
  }

  public form: FormGroup;
  public settingsForm: FormGroup;
  public editMode: boolean = false;
  @ViewChild('card', { static: true }) public card: WsiCardComponent;
  public generalControls: DynamicFormControl[];
  public settingsControls: DynamicFormControl[];

  ngOnInit(): void {
    this.generalControls = [
      {
        type: FormTextComponent,
        config: {
          name: 'name',
          type: 'text',
          label: 'Company Name',
          placeholder: 'Enter Company Name',
          value: this.partner.name,
          styleClass: 'col-4',
          validation: [Validators.required],
          errorMessages: {
            required: 'Company Name is required',
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
          value: this.partner.email,
          styleClass: 'col-4',
          validation: [Validators.required, Validators.maxLength(128)],
          errorMessages: {
            required: 'Email is required',
            maxlength: 'Email exceeds the maximum length',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'phone',
          type: 'text',
          label: 'Phone',
          placeholder: 'Enter Phone',
          value: this.partner.phone,
          styleClass: 'col-4',
          validation: [Validators.required, Validators.maxLength(32)],
          errorMessages: {
            required: 'Phone is required',
            maxlength: 'Phone exceeds the maximum length',
          },
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'address',
          type: 'text',
          label: 'Address',
          placeholder: 'Enter Address',
          value: this.partner.address,
          styleClass: 'col-4',
          validation: [],
          errorMessages: {},
        },
      },
      {
        type: FormTextComponent,
        config: {
          name: 'id',
          type: 'hidden',
        },
      },
    ];

    this.settingsControls = [
      {
        type: FormSelectComponent,
        config: {
          name: 'language',
          label: 'Language',
          placeholder: 'Select language',
          styleClass: 'col-4',
          // optionsArr$:,
          // validation: [],

          // errorMessages: {},
        },
      },
      {
        type: FormTextComponent,
        config: {
          type: 'hidden',
          name: 'temp',
          styleClass: 'col-12',
        },
      },
      {
        type: FormCheckboxComponent,
        config: {
          name: '2fa',
          styleClass: 'col-2',
          data: {
            checkboxLabel: 'Two factor auth',
          },
        },
      },
    ];
  }

  public patchGeneral(val: any) {
    const model = {
      id: this.partner.id,
      name: val.name,
      phone: val.phone,
      email: val.email,
      address: val.address,
    };

    this.partnersService
      .updateGeneralDetails(this.partner.id, model)
      .toPromise()
      .then((res) => {
        this.partner = res;
        this.notificationsService.success(`${this.partner.name} details updated successfully`);
        this.card?.toggleEdit();
      });
  }

  public getMediaTypeName(type: number) {
    return PartnerDocumentType[type];
  }

  public openInFullscreen(mediaItem: PartnerMediaModel) {
    let name: string = this.mediaItems.find((x) => x.value == mediaItem.mediaId)?.label;
    const carMediaFullScreen = this.modalService.show(FullScreenModalComponent, {
      initialState: { mediaItem: mediaItem, title: name },
      class: 'modal-xl modal-dialog-centered',
    });
  }

  public docActions: SelectItem[] = [
    {
      label: 'Fullscreen',
      click: (val: any) => this.openInFullscreen({ mediaId: val }),
      icon: faExpand,
      value: null,
    },
    { label: 'Remove', icon: faTrash, click: (val: any) => null, value: null },
  ];

  private mediaItems: SelectItem[];
  public get docs(): SelectItem[] {
    if (!this.mediaItems?.length) {
      this.mediaItems = this.partner.mediaItems?.map((media) => {
        return {
          label: this.getMediaTypeName(media.documentType),
          value: media.mediaId,
        } as SelectItem;
      });
    }
    return this.mediaItems;
  }
}

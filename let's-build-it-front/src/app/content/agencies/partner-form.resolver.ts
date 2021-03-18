import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PageFormConfig } from '../../@shared/models/edit-form.config';
import { PartnersService } from '../agencies/partners.service';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PartnerFormService } from '../agencies/partner-form.service';
import { WizardFormConfig } from '@app/@shared/models/wizard-form.config';
import { PartnerModel } from '@app/@shared/models/partner.model';
import { FormsModule } from '@angular/forms';
import { PartnerDocumentType } from '../../@shared/models/partner-media.model';

@Injectable({
  providedIn: 'root',
})
export class PartnerFormResolverService implements Resolve<WizardFormConfig> {
  constructor(private partnersService: PartnersService, private partnerFormService: PartnerFormService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): WizardFormConfig {
    let isEdit = route.paramMap.get('id') != 'create';

    const titleEmitter: Subject<string> = new Subject<string>();
    const pageConfig = {
      title$: titleEmitter,
      breadcrumbs: [{ label: 'Agencies', url: '../' }, { label: 'Partner' }],
      arrayConfig: {
        controls: this.partnerFormService.generate(isEdit),
      },
      submit: (model) => {
        let modelToPost: PartnerModel = {} as PartnerModel;
        modelToPost.mediaItems = [];
        if (!!model.forms[1]?.logoImgId || !!model.forms[1]?.logoImgId?.length) {
          modelToPost.logoImgId = !!model.forms[1]?.logoImgId?.length ? model.forms[1].logoImgId[0].id : model.forms[1]?.logoImgId;
        }
        if (!!model.forms[1]?.contractMediaId?.length) {
          modelToPost.mediaItems.push({ mediaId: model.forms[1].contractMediaId[0].id, documentType: PartnerDocumentType.Contract });
        }
        if (!!model.forms[1]?.disclaimerMediaId?.length) {
          modelToPost.mediaItems.push({ mediaId: model.forms[1].disclaimerMediaId[0].id, documentType: PartnerDocumentType.Disclaimer });
        }
        if (!!model.forms[1]?.legalMediaId?.length) {
          modelToPost.mediaItems.push({ mediaId: model.forms[1].legalMediaId[0].id, documentType: PartnerDocumentType.Legal });
        }
        modelToPost.id = model.forms[0].id;
        modelToPost.name = model.forms[0].name;
        modelToPost.companyExternalId = model.forms[0].companyExternalId;
        modelToPost.vatId = model.forms[0].vatId;
        modelToPost.phone = model.forms[0].phone;
        modelToPost.email = model.forms[0].email;
        modelToPost.address = model.forms[0].address;
        modelToPost.status = model.forms[0].status;

        if (isEdit) {
          return this.partnersService.update(modelToPost.id, modelToPost);
        } else {
          return this.partnersService.create(modelToPost);
        }
      },
      getEntityById: (id) =>
        this.partnersService.get(id).pipe(
          tap((x: PartnerModel) => {
            if (!!isEdit) {
              titleEmitter.next(`Edit ${x.name}`);
            }
            x['contractMediaId'] = x.mediaItems?.find(z => z.documentType == PartnerDocumentType.Contract)?.mediaId;
            x['disclaimerMediaId'] = x.mediaItems?.find(z => z.documentType == PartnerDocumentType.Disclaimer)?.mediaId;
            x['legalMediaId'] = x.mediaItems?.find(z => z.documentType == PartnerDocumentType.Legal)?.mediaId;
            return x;
          })
        ),
    } as WizardFormConfig;

    return pageConfig;
  }
}

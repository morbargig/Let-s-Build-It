import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WizardFormConfig } from '../../@shared/models/wizard-form.config';
import { BookingService } from './booking.service';
import { Subject } from 'rxjs';
import { BookingModel } from '../../@shared/models/booking.model';
import { tap } from 'rxjs/operators';
import { BookingFormService } from './booking-form.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BookingFormResolverService implements Resolve<WizardFormConfig> {
  constructor(
    private entityFormService: BookingFormService,
    private entityService: BookingService,

  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): WizardFormConfig {
    let isEdit = route.paramMap.get('id') != 'create';
    const titleEmitter: Subject<string> = new Subject<string>();
    const formChanged$: Subject<FormGroup> = new Subject<FormGroup>();
    titleEmitter.next(`Edit Booking`);
    const pageConfig: WizardFormConfig = {
      title: 'Booking',
      title$: titleEmitter,
      breadcrumbs: [{ label: 'Booking', url: '../' }, { label: 'Booking Wizard' }],
      arrayConfig: {
        controls: this.entityFormService.generate(),
      },
      submit: (formObj: { forms: any[] }) => {
        let modelToPost: BookingModel = {} as BookingModel;
        let formValues = formObj.forms
        let ancillaryFormValue = formValues[0]
        debugger
        // modelToPost.mediaItems = [];
        // if (!!model.forms[1]?.logoImgId || !!model.forms[1]?.logoImgId?.length) {
        //   modelToPost.logoImgId = !!model.forms[1]?.logoImgId?.length ? model.forms[1].logoImgId[0].id : model.forms[1]?.logoImgId;
        // }
        // if (!!model.forms[1]?.contractMediaId?.length) {
        //   modelToPost.mediaItems.push({ mediaId: model.forms[1].contractMediaId[0].id, documentType: PartnerDocumentType.Contract });
        // }
        // if (!!model.forms[1]?.disclaimerMediaId?.length) {
        //   modelToPost.mediaItems.push({ mediaId: model.forms[1].disclaimerMediaId[0].id, documentType: PartnerDocumentType.Disclaimer });
        // }
        // if (!!model.forms[1]?.legalMediaId?.length) {
        //   modelToPost.mediaItems.push({ mediaId: model.forms[1].legalMediaId[0].id, documentType: PartnerDocumentType.Legal });
        // }
        // modelToPost.id = model.forms[0].id;
        // modelToPost.name = model.forms[0].name;
        // modelToPost.companyExternalId = model.forms[0].companyExternalId;
        // modelToPost.vatId = model.forms[0].vatId;
        // modelToPost.phone = model.forms[0].phone;
        // modelToPost.email = model.forms[0].email;
        // modelToPost.address = model.forms[0].address;
        // modelToPost.status = model.forms[0].status;
        if (isEdit) {
          return this.entityService.update(modelToPost.id, modelToPost);
        } else {
          return this.entityService.create(modelToPost);
        }
      },
      getEntityById: (id) =>
        this.entityService.get(id).pipe(
          tap((x: BookingModel) => {
            if (!!isEdit) {
              titleEmitter.next(`Edit Booking`); // FIXME: maybe to add booking name or id
            }
            return x;
          })
        ),
      formChanged$: formChanged$,
    } as WizardFormConfig;

    return pageConfig;
  }
}


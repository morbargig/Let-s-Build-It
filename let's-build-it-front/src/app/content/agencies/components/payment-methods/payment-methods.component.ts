import { Component, OnInit, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { take, catchError, takeUntil, finalize } from 'rxjs/operators';
import { BankAccountModel } from '@app/@shared/models/payment-methods.model';
import { SideBarPageService } from '../../../../@shared/components/side-bar-page/isidibar-service.interface';
import { PartnerModel } from '../../../../@shared/models/partner.model';
import { FormGroup } from '@angular/forms';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { LazyLoadEvent, FilterObject } from '../../../../@ideo/components/table/events/lazy-load.event';
import { MatchMode } from '../../../../@ideo/components/table/models/table-filter';
import { ContactsModel } from '../../../../@shared/models/contacts.model';
import { PartnersService } from '../../partners.service';
import { concat } from 'rxjs';
import { WsiCardComponent } from '../../../../@shared/components/wsi-card/wsi-card.component';
import { NotificationsService } from '../../../../@ideo/components/notifications/notifications.service';
import { BankAccountFormService } from './forms/bank-account-form.service';
import { ContactPersonFormService } from './forms/contact-person-form.service';
import { BillingFormService } from './forms/billing-form.service';
import { CompanyFormService } from './forms/company-form.service';
import { PartnerBankAccountsService } from '../../partner-bank-accounts.service';

@Component({
  selector: 'prx-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
})
export class PaymentMethodsComponent implements OnInit, OnDestroy {
  @ViewChild('paymentMethods', { static: true }) public paymentMethods: WsiCardComponent
  public bankAccountForm: FormGroup;
  public contactPersonForm: FormGroup;
  public companyAccountForm: FormGroup;
  public billingForm: FormGroup;
  public editMode: boolean = false;
  private endded: EventEmitter<boolean> = new EventEmitter<boolean>();

  private contactValue: ContactsModel;
  public get contact(): ContactsModel {
    return this.contactValue;
  }
  public set contact(contact: ContactsModel) {
    this.contactValue = contact;
  }

  private bankAccountValue: BankAccountModel;

  public get bankAccount(): BankAccountModel {
    return this.bankAccountValue;
  }
  public set bankAccount(bankAccount: BankAccountModel) {
    this.bankAccountValue = bankAccount;
  }

  public get partner(): PartnerModel {
    return this.sidebarService.entity;
  }
  public set partner(partner: PartnerModel) {
    this.sidebarService.entity = partner;
  }

  public companyAccountControls: DynamicFormControl[] = this.companyFormService.generate(this.partner);
  public billingControls: DynamicFormControl[] = this.billingFormService.generate(this.partner);
  public contactPersonControls: DynamicFormControl[] = this.contactPersonFormService.generate(this.partner);
  public bankAccountControls: DynamicFormControl[];

  constructor(private sidebarService: SideBarPageService,
    private partnersService: PartnersService,
    private partnerBankAccountsService: PartnerBankAccountsService,
    private notificationsService: NotificationsService,
    private bankAccountFormService: BankAccountFormService,
    private contactPersonFormService: ContactPersonFormService,
    private billingFormService: BillingFormService,
    private companyFormService: CompanyFormService,
  ) {

  }
  ngOnDestroy(): void {
    this.endded.next(true);
  }

  ngOnInit(): void {
    this.getData()

  }

  getData(): void {
    let evt = { page: 1, pageSize: 1, filters: { 'IsDefault': { matchMode: MatchMode.Equals, value: true } } as FilterObject } as LazyLoadEvent
    this.partnerBankAccountsService.getAll(this.partner.id, evt).pipe(takeUntil(this.endded)).subscribe(res => {
      if (res?.total) {
        this.bankAccount = res.data[0];
        if (!this.bankAccountControls) {
          this.bankAccountControls = this.bankAccountFormService.generate(this.partner, this.bankAccount);
        }
        this.bankAccountControls.patchValue(this.bankAccount)
      }else{
        this.bankAccountControls = this.bankAccountFormService.generate(this.partner, this.bankAccount);
      }
    })

    this.contactPersonControls.patchValue(this.partner)
    this.companyAccountControls.patchValue(this.partner)
    this.billingControls.patchValue(this.partner)
    this.billingControls.forEach(i => {
      if (i.config.value && i.config.type === "date") {
        i.config.value = i.config.value.slice(0, 10)
      }
    })
  }

  onSubmit(): void {
    const bankAccountValues = this.bankAccountForm.getRawValue() as BankAccountModel
    const billingValues = this.billingForm.getRawValue() as PartnerModel
    const contactPersonValues = this.contactPersonForm.getRawValue() as PartnerModel
    const companyAccountValues = this.companyAccountForm.getRawValue() as PartnerModel

    const reqArr = []
    const errorsArr: any[] = []

    let handelErr = (err: any): void => {
      errorsArr.push(err)
      this.notificationsService.error(err?.error?.message || err?.message, "Update Failed")
    }

    reqArr.push(
      this.partnersService.updateAccountDetails(this.partner.id, companyAccountValues),
      this.partnersService.updateBillingDetails(this.partner.id, billingValues),
      this.partnersService.updateContactPersonDetails(this.partner.id, contactPersonValues),
      this.partnerBankAccountsService.create(this.partner.id, bankAccountValues),
    );

    concat(...reqArr).pipe(
      takeUntil(this.endded),
      catchError(err => {
        handelErr(err)
        return err
      }),
      finalize(() => {
        this.editMode = false;
        this.partnersService.get(this.partner.id).pipe(take(1)).subscribe(partner => {
          this.sidebarService.setEntity(partner)
          this.getData()
        })
        this.notificationsService.success("Update successfully", "Success")
      })).subscribe((res) => {
        return res;
      })
  }
}

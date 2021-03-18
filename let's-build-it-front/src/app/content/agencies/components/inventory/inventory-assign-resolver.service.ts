import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { InventoriesService } from '../../../inventories/inventories.service';
import { InventoryFormService } from '../../../inventories/inventory-form.service';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { InventoryModel } from '../../../../@shared/models/inventory.model';
import { ModalMessage } from '../../../../@core/models/modal-message';
import { FormSelectComponent } from '../../../../@forms/form-fields/form-select/form-select.component';
import { FormTextComponent } from '../../../../@forms/form-fields/form-text/form-text.component';
import { ModalAssignPageModelConfig } from '../../../../@shared/components/modal-assign-page/modal-assign-page.model';
import { CarsService } from '../../../vehicles/services/cars.service';
import { map } from 'rxjs/operators';
import { PickModel } from '../../../../@shared/components/modal-assign-page/pick.model';
import { IPagedList } from '../../../../@shared/models/paged-list.response';
import { DynamicFormStepMode } from '@app/@forms/@core/interfaces';
import { NotificationsService } from '../../../../@ideo/components/notifications/notifications.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class InventoryAssignResolverService implements Resolve<ModalAssignPageModelConfig>  {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inventoriesService: InventoriesService,
    private carsService: CarsService,
    private notificationsService: NotificationsService,
    private location: Location
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ModalAssignPageModelConfig | Observable<ModalAssignPageModelConfig> | Promise<ModalAssignPageModelConfig> {
    let formControls: DynamicFormControl[] = [{
      type: FormTextComponent,
      config: {
        mode: DynamicFormStepMode.TableCell,
        name: 'plateNo',
        type: 'text',
        label: 'Plate Number',
        placeholder: 'Select Plate Number',
        value: null,
        optionsArr: [
          { label: 'id', value: 1 },
        ],
        styleClass: 'col-4',
      },
    },
    {
      type: FormSelectComponent,
      config: {
        mode: DynamicFormStepMode.TableCell,
        name: 'id',
        type: 'text',
        label: 'Manufacturer',
        placeholder: 'Select Manufacturer',
        value: null,
        optionsArr: [
          { label: 'id', value: 1 },
        ],
        styleClass: 'col-4',
      },
    },
    {
      type: FormSelectComponent,
      config: {
        mode: DynamicFormStepMode.TableCell,
        name: 'id',
        label: 'Modal',
        placeholder: 'Select Model',
        value: null,
        optionsArr: [
          { label: 'id', value: 1 },
        ],
        styleClass: 'col-4',
      },
    },]
    let type$: Subject<ModalMessage> = new Subject<ModalMessage>();
    const handelPageNotFound = (): void => {
      setTimeout(() => {
        type$.next({
          mode: 'Not Found',
          title: 'Not Found',
          subTitle: 'Sorry, page not found',
          message: 'Please make sure you have typed the correct URL',
          closeUrl: '../../'
        })
      })
    }
    let handleError = (err: any) => {
      this.notificationsService.error(err || 'Assign Fail', "update Fail")
    }
    return {
      type: type$,
      submit: (selected: PickModel, model: InventoryModel) => {
        let newInventory = model
        newInventory.carId = selected.id
        this.inventoriesService.update(model.id, model).toPromise().then(res => {
          if (!!res) {
            this.notificationsService.success("Inventory Assign Successfully", "Update Successfully")
            this.location.back()
          }
          else {
            handleError(res)
          }
        }).catch(err => {
          handleError(err)
          this.notificationsService.error(err, "Assign Fail")
        })
      },
      getAll: (evt) => this.carsService.getAll(evt).pipe(map(res => {
        let pagedRes = {
          data: res?.data?.map(i => {
            return {
              id: i.id,
              img: i.profileImgId,
              title: `${i.model} ${i.modelYear}`,
              detailsArr: [{ text: i.plateNo, icon: '' }, { text: i.seatsNo, icon: 'seats' }, { text: i.doorsNumber, icon: 'doors' }, { text: i.manufacturer, icon: '' }]
            } as PickModel
          })
          , total: res?.total
        } as IPagedList<PickModel>;
        return pagedRes
      })),
      getEntityById: (routePrams) => {
        if ('id' in routePrams) {
          let req = this.inventoriesService.get(routePrams.id);
          req.toPromise().then(res => {
            if (!!res) {
              type$.next({
                mode: 'Assign',
                title: 'Assign',
                closeUrl: '../../'
              })
              return
            }
            type$.next({
              mode: 'Not Found',
              title: 'Not Found',
              subTitle: 'Sorry, Inventory not found',
              message: 'Please make sure you have typed the correct URL',
              closeUrl: '../../'
            })
            return
          }).catch(() => {
            handelPageNotFound()
          })
          return req
        }
        else {
          handelPageNotFound()
        }
      },
      filterControls: formControls,
    } as ModalAssignPageModelConfig
  }
}

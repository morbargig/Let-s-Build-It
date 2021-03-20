import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ModalPageModelConfig } from '../../../../@shared/components/modal-page/modal-page.model';
import { InventoryFormService } from '../../../inventories/inventory-form.service';
import { InventoriesService } from '../../../inventories/inventories.service';
import { InventoryModel } from '../../../../@shared/models/inventory.model';
import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';
import { InventoryType } from '../../../../@shared/interfaces/inventory-type.enum';
import { ModalMessage } from '../../../../@core/models/modal-message';

@Injectable({
  providedIn: 'root',
})
export class CreateOrEditResolverService implements Resolve<ModalPageModelConfig> {
  constructor(private inventoryFormService: InventoryFormService, private inventoriesService: InventoriesService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): ModalPageModelConfig | Observable<ModalPageModelConfig> | Promise<ModalPageModelConfig> {
    let formControls$: Subject<DynamicFormControl[]> = new Subject<DynamicFormControl[]>();
    let formControls: DynamicFormControl[] = null;
    let inventory: InventoryModel = null;
    let type$: Subject<ModalMessage> = new Subject<ModalMessage>();
    return {
      type: type$,
      getEntityById: (routePrams) => {
        if ('id' in routePrams) {
          this.inventoriesService
            .get(routePrams.id)
            .toPromise()
            .then((res) => {
              if (!!res) {
                formControls = this.inventoryFormService.generate(true, res);
                inventory = res;
                formControls$.next(formControls);
                type$.next({
                  mode: 'Edit',
                  title: 'Edit Inventory',
                });
                return;
              }
              type$.next({
                mode: 'Not Found',
                title: 'Not Found',
                subTitle: 'Sorry, Inventory not found',
                message: 'Please make sure you have typed the correct URL',
              });
              return;
            });
        } else if ('type' in routePrams && routePrams.type in InventoryType) {
          formControls = this.inventoryFormService.generate(false);
          for (let i of formControls) {
            if (i.config.name === 'inventoryType') {
              i.config.type = 'hidden';
              i.config.value = InventoryType[routePrams.type];
              break;
            }
          }
          setTimeout(() => {
            type$.next({
              mode: 'Create',
              title: 'Create Inventory',
            });
          });
        } else {
          setTimeout(() => {
            type$.next({
              mode: 'Not Found',
              title: 'Not Found',
              subTitle: 'Sorry, page not found',
              message: 'Please make sure you have typed the correct URL',
            });
          });
        }
        formControls$.next(formControls);
      },
      formControls: formControls$,
      closeUrl: '../../',
    } as ModalPageModelConfig;
  }
}

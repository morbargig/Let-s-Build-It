import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PageFormConfig } from '../../@shared/models/edit-form.config';
import { InventoriesService } from '../inventories/inventories.service';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InventoryModel } from '../../@shared/models/inventory.model';
import { InventoryType } from '../../@shared/interfaces/inventory-type.enum';
import { InventoryFormService } from '../inventories/inventory-form.service';
@Injectable({
  providedIn: 'root',
})
export class InventoryFormResolverService implements Resolve<PageFormConfig> {
  constructor(private inventoriesService: InventoriesService, private inventoryFormService: InventoryFormService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PageFormConfig {
    let isEdit = route.paramMap.get('id') != 'create';
    const titleEmitter: Subject<string> = new Subject<string>();
    const pageConfig = {
      title$: titleEmitter,
      breadcrumbs: [{ label: 'Inventories', url: '../' }, { label: 'Inventory' }],
      groupConfig: {
        controls: this.inventoryFormService.generate(isEdit),
      },
      submit: (model: InventoryModel) => {
        if (isEdit) {
          return this.inventoriesService.update(model.id, model);
        } else {
          return this.inventoriesService.create(model);
        }
      },
      getEntityById: (id) =>
        this.inventoriesService.get(id).pipe(
          tap((x) => {
            if (!!isEdit) {
              titleEmitter.next(`Edit ${InventoryType[x.inventoryType]}`);
            }
            return x;
          })
        ),
    } as PageFormConfig;

    return pageConfig;
  }
}

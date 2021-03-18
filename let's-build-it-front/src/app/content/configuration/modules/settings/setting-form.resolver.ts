import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PageFormConfig } from '../../../../@shared/models/edit-form.config';
import { SettingsService } from '../settings/settings.service';
import { SettingModel } from '../../../../@shared/models/setting.model';
import { SettingsFormService } from './settings-form.service';
@Injectable({
  providedIn: 'root',
})
export class SettingFormResolverService implements Resolve<PageFormConfig> {
  constructor(private settingsService: SettingsService, private settingsFormService: SettingsFormService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PageFormConfig {
    let isEdit = route.paramMap.get('id') != 'create';

    const titleEmitter: Subject<string> = new Subject<string>();
    const pageConfig = {
      title$: titleEmitter,
      breadcrumbs: [{ label: 'Configuration' }, { label: 'Settings', url: '../' }, { label: 'Setting' }],
      groupConfig: {
        controls: this.settingsFormService.generate(isEdit),
      },
      submit: (model: SettingModel) => {
        if (isEdit) {
          return this.settingsService.update(model.id, model);
        } else {
          return this.settingsService.create(model);
        }
      },
      getEntityById: (id) =>
        this.settingsService.get(id).pipe(
          tap((x) => {
            if (!!isEdit) {
              titleEmitter.next(`Edit '${x.name}'`);
            }
            return x;
          })
        ),
    } as PageFormConfig;

    return pageConfig;
  }
}

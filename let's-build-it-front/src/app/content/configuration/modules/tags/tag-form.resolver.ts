import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PageFormConfig } from '../../../../@shared/models/edit-form.config';
import { TagsService } from './tags.service';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TagFormService } from './tag-form.service';
@Injectable({
  providedIn: 'root',
})
export class TagFormResolverService implements Resolve<PageFormConfig> {
  constructor(private tagsService: TagsService, private tagFormService: TagFormService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PageFormConfig {
    let isEdit = route.paramMap.get('id') != 'create';
    const titleEmitter: Subject<string> = new Subject<string>();
    const pageConfig = {
      title$: titleEmitter,
      breadcrumbs: [{ label: 'Tags', url: '../' }, { label: 'Tag' }],
      groupConfig: {
        controls: this.tagFormService.generate(isEdit),
      },
      submit: (model: any) => {
        if (isEdit) {
          return this.tagsService.update(model.id, model);
        } else {
          return this.tagsService.create(model);
        }
      },
      getEntityById: (id) =>
        this.tagsService.get(id).pipe(
          tap((x) => {
            if (!!isEdit) {
              titleEmitter.next(`Edit Tag ${x.key}`);
            }
            return x;
          })
        ),
    } as PageFormConfig;

    return pageConfig;
  }
}

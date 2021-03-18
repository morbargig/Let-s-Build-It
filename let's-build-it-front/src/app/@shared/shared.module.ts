import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BootstrapModule } from '@app/bootstrap/bootstrap.module';
import { CardsModule } from '@app/blocks/cards/cards.module';
import { FormControlsModule } from '@app/blocks/form-controls/form-controls.module';
import { IconsModule } from '@app/blocks/icons/icons.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { UnsanitizePipe } from './pipes/unsanitize.pipe';
import { GroupByPipe } from './pipes/group-by.pipe';
import { TabledPageComponent } from './components/tabled-page/tabled-page.component';
import { UtilsModule } from '../blocks/utils/utils.module';
import { TableModule } from '../@ideo/components/table/table.module';
import { LoaderModule } from '@app/@ideo/components/loader/loader.module';
import { IdeoPipesModule } from '../@ideo/infrastructure/pipes/pipes.module';
import { ButtonModule } from '@app/@ideo/components/button/button.module';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormPagedComponent } from './components/form-paged/form-paged.component';
import { NavigationsModule } from '../blocks/navigations/navigations.module';
import { IdeoFormsModule } from '../@forms/ideo-forms.module';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { WizardPageComponent } from './components/wizard-page/wizard-page.component';
import { ImportComponent } from './components/import/import.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FullScreenModalComponent } from './components/full-screen-modal/full-screen-modal.component';
import { WsiCardComponent } from './components/wsi-card/wsi-card.component';
import { SideBarPageComponent } from './components/side-bar-page/side-bar-page.component';
import { EntityDetailsComponent } from './components/side-bar-page/entity-details/entity-details.component';
import { KeyValuePairComponent } from './components/key-value-pair/key-value-pair.component';
import { DocsComponent } from './components/docs/docs.component';
import { WsiModalComponent } from './components/wsi-modal/wsi-modal.component';
import { ModalPageComponent } from './components/modal-page/modal-page.component';
import { ModalAssignPageComponent } from './components/modal-assign-page/modal-assign-page.component';
import { TabsPageComponent } from './components/tabs-page/tabs-page.component';

const exportModules = [
  // external modules
  CommonModule,
  HttpClientModule,
  RouterModule,
  TranslateModule,
  PerfectScrollbarModule,

  // custom modules
  BootstrapModule,
  CardsModule,
  IconsModule,
  FormControlsModule,
];

@NgModule({
  declarations: [
    UnsanitizePipe,
    GroupByPipe,
    TabledPageComponent,
    FormPagedComponent,
    DeleteModalComponent,
    WizardPageComponent,
    ImportComponent,
    FullScreenModalComponent,
    WsiCardComponent,
    SideBarPageComponent,
    EntityDetailsComponent,
    KeyValuePairComponent,
    DocsComponent,
    WsiModalComponent,
    ModalPageComponent,
    ModalAssignPageComponent,
    TabsPageComponent,
  ],
  imports: [
    ...exportModules,
    UtilsModule,
    NavigationsModule,
    IdeoFormsModule,
    TableModule,
    LoaderModule,
    ButtonModule,
    IdeoPipesModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgxDropzoneModule,
  ],
  exports: [
    UnsanitizePipe,
    GroupByPipe,
    ...exportModules,
    ImportComponent,
    FullScreenModalComponent,
    WsiCardComponent,
    SideBarPageComponent,
    KeyValuePairComponent,
    DocsComponent,
    WsiModalComponent,
    ModalPageComponent,
    TabsPageComponent,
  ],
})
export class SharedModule {}

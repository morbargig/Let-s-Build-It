import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PermitPipe } from './has-permit.pipe';
import { IdeoDatePipe } from './ideo-date.pipe';
import { SubStrPipe } from './sub-str.pipe';
import { FilterPipe } from './filter.pipe';
import { ImageIdPipe } from './image-id.pipe';
import { LogPipe } from './log.pipe';
import { ColorHashPipe } from './color-hash.pipe';
import { AcronymPipe } from './acronym.pipe';
import { IconPipe } from './icon.pipe';
import { PxPipe } from './px.pipe';

const PIPES = [
  PermitPipe,
  IdeoDatePipe,
  SubStrPipe,
  FilterPipe,
  ImageIdPipe,
  LogPipe,
  ColorHashPipe,
  AcronymPipe,
  IconPipe,
  PxPipe,
];

@NgModule({
  declarations: [...PIPES],
  exports: [...PIPES],
  imports: [CommonModule],
  providers: [...PIPES, DatePipe],
})
export class IdeoPipesModule {}

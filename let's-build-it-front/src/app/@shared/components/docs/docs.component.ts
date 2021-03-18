import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { SelectItem } from '../../../@ideo/components/table/models/select-item';

@Component({
  selector: 'prx-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsComponent implements OnInit {
  constructor() {}

  public icons: any = {
    expand: faExpand,
  };

  @Input() public items: SelectItem[];
  @Input() public itemActions: SelectItem[] = [];
  @Input() public showAdd: boolean = true;
  @Output() public add: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {}
}

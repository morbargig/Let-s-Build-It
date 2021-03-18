import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'prx-wsi-card',
  templateUrl: './wsi-card.component.html',
  styleUrls: ['./wsi-card.component.scss'],
})
export class WsiCardComponent implements OnInit {
  constructor() {}

  @Input() public title: string;
  @Input() public showEdit: boolean;

  @Input() public alignment: string = 'start';
  @Input() public fullHeight: boolean = false;
  @Input() public loading: boolean = false;
  @Input() public fuller: boolean = false;
  @Input() public showHeader: boolean = true;
  @Input() public editMode: boolean = false;
  @Output() public editModeChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {}

  public toggleEdit() {
    this.editMode = !this.editMode;
    this.editModeChanged.emit(this.editMode);
  }
}

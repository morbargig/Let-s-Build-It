import { Component, OnInit } from '@angular/core';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';

@Component({
  selector: 'prx-image-cell',
  templateUrl: './image-cell.component.html',
  styleUrls: ['./image-cell.component.scss'],
})
export class ImageCellComponent implements OnInit, TableCell {
  public col: TableColumn<any>;
  public item: any;
  public isStatic: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}

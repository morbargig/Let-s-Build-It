import { Component, OnInit } from '@angular/core';
import { IdeoDatePipe } from '@app/@ideo/infrastructure/pipes/ideo-date.pipe';
import { TableColumn } from '../../../../../@ideo/components/table/models/table-column';
import { TableCell } from '../../models/table-cell';

@Component({
  selector: 'prx-date-time-cell',
  templateUrl: './date-time-cell.component.html',
  styleUrls: ['./date-time-cell.component.scss'],
})
export class DateTimeCellComponent implements OnInit, TableCell {
  public col: TableColumn<any>;
  public item: any;

  constructor() {}

  ngOnInit(): void {}
}

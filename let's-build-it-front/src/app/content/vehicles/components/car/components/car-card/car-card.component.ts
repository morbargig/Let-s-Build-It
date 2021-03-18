import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'prx-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.scss'],
})
export class CarCardComponent implements OnInit {
  constructor() {}

  @Input() public title: string;

  ngOnInit(): void {}
}

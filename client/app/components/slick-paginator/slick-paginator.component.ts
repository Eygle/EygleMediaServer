import {Component, Input, OnInit} from '@angular/core';
import {SlickComponent} from 'ngx-slick';

@Component({
  selector: 'ems-slick-paginator',
  templateUrl: './slick-paginator.component.html',
  styleUrls: ['./slick-paginator.component.scss']
})
export class SlickPaginatorComponent implements OnInit {

  @Input() slick: SlickComponent;

  constructor() {
  }

  ngOnInit() {
  }

  disableSlidePrev() {
    return !this.slick || !this.slick['$instance'] || this.slick['$instance'][0].slick.$prevArrow.hasClass('slick-disabled');
  }

  disableSlideNext() {
    return !this.slick || !this.slick['$instance'] || this.slick['$instance'][0].slick.$nextArrow.hasClass('slick-disabled');
  }

}

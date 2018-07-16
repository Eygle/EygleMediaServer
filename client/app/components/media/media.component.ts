import {Component, Input, OnInit} from '@angular/core';
import {Media} from '../../../../commons/models/Media';

@Component({
  selector: 'ems-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  @Input() media: Media;

  @Input() placeholderIcon: string;

  @Input() route: string;

  constructor() {
  }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {Media} from "../../../../commons/models/Media";

@Component({
  selector: 'ems-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {

  @Input() media: Media;

  @Input() placeholderIcon: string;

  @Input() route: string;

  constructor() {
  }

  ngOnInit() {
  }

}

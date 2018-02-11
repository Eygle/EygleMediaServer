import * as _ from 'underscore';

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'ems-urls-modal',
  templateUrl: './urls-modal.component.html',
  styleUrls: ['./urls-modal.component.scss']
})
export class UrlsModalComponent {

  constructor(public dialogRef: MatDialogRef<UrlsModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  formatUrlsList(): string {
    const urlParts = window.location.href.split('/');
    const host = `${urlParts[0]}//${urlParts[2]}`;

    return _.map(this.data.files, (f) => {
      return `${host}${f.url}`;
    }).join('\n');
  }
}

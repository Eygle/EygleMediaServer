import * as _ from 'underscore';

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'ems-urls-modal',
  templateUrl: './urls-modal.component.html',
  styleUrls: ['./urls-modal.component.scss']
})
export class UrlsModalComponent {

  /**
   * List of files urls
   */
  public urls: string[] = [];

  /**
   * Current host
   */
  private _host: string;

  constructor(public dialogRef: MatDialogRef<UrlsModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    const urlParts = window.location.href.split('/');
    this._host = `${urlParts[0]}//${urlParts[2]}`;

    this.urls = _.map(_.filter(data.files, (f) => {
      return !f.directory;
    }), (f) => {
      return `${this._host}/dl/${f._id}`;
    });
  }
}

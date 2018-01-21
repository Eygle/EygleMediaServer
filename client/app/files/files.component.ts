import {Component, OnInit, ViewChild} from '@angular/core';
import {FilesService} from "../services/files.service";
import {EygleFile} from "../../../commons/models/file";
import {MatSort, MatTableDataSource} from "@angular/material";

import * as _ from 'underscore';
import {PerfectScrollbarDirective} from "ngx-perfect-scrollbar";

@Component({
  selector: 'ems-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  /**
   * Breadcrumbs
   */
  bc: EygleFile[];

  /**
   * Current root file
   */
  root: EygleFile;

  /**
   * Table data source
   */
  dataSource: MatTableDataSource<EygleFile>;

  /**
   * Table columns
   * @type {string[]}
   */
  displayedColumns = ['icon', 'filename', 'size', 'mtime'];

  /**
   * List of selected files
   */
  selected: EygleFile[];

  /**
   * Is loading data from API
   */
  isLoading: boolean;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  constructor(private filesService: FilesService) {
    this.dataSource = new MatTableDataSource();
    this.selected = [];
    this.bc = [];
    this.root = null;
    this.isLoading = false;
  }

  ngOnInit() {
    this.refresh();
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  refresh(): void {
    this.isLoading = true;
    this.selected = [];
    console.log("refresh with root id", this.root ? this.root._id : null);
    this.filesService.getChildren(this.root ? this.root._id : null)
      .subscribe((res: EygleFile[]) => {
        this.dataSource.data = res;
        this.isLoading = false;
        this.directiveScroll.update();
        this.directiveScroll.scrollTo(0, 0, 100);
      });
  }

  /**
   * Select/unselect file
   * @param {EygleFile} file
   */
  select(file: EygleFile): void {
    file.selected = !file.selected;
    if (file.selected) {
      this.selected.push(file);
    } else {
      this.selected = _.without(this.selected, file);
    }
  }

  /**
   * Open directory
   * @param {EygleFile} dir
   */
  open(dir: EygleFile = null): void {
    if (!dir) {
      this.bc = [];
      this.root = null;
      this.refresh();
    } else if (dir.directory) {
      this.bc.push(dir);
      this.root = dir;
      this.refresh();
    }
    this.selected = [];
  }

  /**
   * Search filter
   * @param {string} filterValue
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.directiveScroll.update();
  }

  /**
   * Get icon
   * @param {EygleFile} file
   * @returns {string}
   */
  getIcon(file: EygleFile): string {
    if (file.directory)
      return "folder";
    return ""
  }
}

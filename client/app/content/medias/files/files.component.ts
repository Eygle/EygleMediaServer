import {Component, OnInit, ViewChild} from '@angular/core';
import {FilesService} from '../../../services/files.service';
import {EygleFile} from '../../../../../commons/models/File';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import * as _ from 'underscore';
import {PerfectScrollbarDirective} from 'ngx-perfect-scrollbar';
import {UrlsModalComponent} from "./modals/urls-modal/urls-modal.component";
import {AuthService} from "../../../services/auth.service";
import {EPermission} from "../../../../../commons/core/core.enums";
import {KeyEvents} from "../../../utils/key-events";
import {EKeyCode} from "../../../typings/client.enums";
import FileUtils from "../../../../../commons/FileUtils";

@Component({
  selector: 'ems-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  /**
   * Breadcrumbs
   */
  bc: [EygleFile];

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
   * Table filter text
   */
  filterText: string = "";

  /**
   * List of selected files
   */
  selected: [EygleFile];

  /**
   * Is loading data from API
   */
  isLoading: boolean;

  /**
   * Key event instance
   */
  keyEvents: KeyEvents;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;

  constructor(private dialog: MatDialog,
              private filesService: FilesService,
              private Auth: AuthService) {
    this.keyEvents = new KeyEvents();
    this.dataSource = new MatTableDataSource();
    this.selected = <[EygleFile]>[];
    this.bc = <[EygleFile]>[];
    this.root = null;
    this.isLoading = false;

    this.keyEvents.onSelectAll.subscribe(() => this.selectAll());
    this.keyEvents.onCancel.subscribe(() => this.unSelectAll());
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
    this.selected = <[EygleFile]>[];
    this.filesService.getChildren(this.root ? this.root._id : null)
      .subscribe((res: [EygleFile]) => {
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
      if (this.keyEvents.isPressed(EKeyCode.SHIFT)) { // SELECT WITH SHIFT
        const displayedList = (<any>this.dataSource)._renderData._value;
        const prevItem = this.selected.length ? this.selected[this.selected.length - 1] : null;
        const prevIdx = prevItem ? _.findIndex(displayedList, (f) => {
          return f._id === prevItem._id;
        }) + 1 : 0;
        const selectIdx = _.findIndex(displayedList, (f) => {
          return f._id === file._id;
        });

        for (let i = (prevIdx < selectIdx ? prevIdx : selectIdx); i < (prevIdx < selectIdx ? selectIdx : prevIdx); i++) {
          if (!displayedList[i].selected) {
            displayedList[i].selected = true;
            this.selected.push(displayedList[i]);
          }
        }
      }
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
      this.bc = <[EygleFile]>[];
      this.root = null;
      this.refresh();
    } else if (dir.directory) {
      this.bc.push(dir);
      this.root = dir;
      this.refresh();
    }
    this.selected = <[EygleFile]>[];
    this.filterText = "";
    this.applyFilter(this.filterText);
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
      return 'folder';
    if (FileUtils.isVideo(file.ext))
      return 'videocam';
    if (FileUtils.isMusic(file.ext))
      return 'music_note';
    if (FileUtils.isSubtitle(file.ext))
      return 'subtitles';
    if (FileUtils.isText(file.ext))
      return 'short_text';
    return '';
  }

  /**
   * Calculate sife of given files
   * @param {[EygleFile]} files
   * @returns {number}
   */
  getTotalSize(files: [EygleFile]): number {
    let size = 0;

    for (const f of files) {
      size += f.size;
    }

    return size;
  }

  /**
   * Open modal that list selected files's urls
   */
  openUrlModal(): void {
    this.dialog.open(UrlsModalComponent, {
      data: {files: this.selected}
    });
  }

  /**
   * Can user do given action
   * @param {string} action
   * @returns {boolean}
   */
  canUser(action: string): boolean {
    switch (action) {
      case 'delete':
        return this.Auth.authorize(EPermission.DeleteFiles);
    }

    return false;
  }

  canSeeLinkIcon(): boolean {
    return this.selected.length && !!~_.findIndex(this.selected, (f: EygleFile) => {
      return !f.directory;
    });
  }

  /**
   * Select all
   */
  selectAll(): void {
    this.selected = <[EygleFile]>[];
    for (const f of this.dataSource.data) {
      f.selected = true;
      this.selected.push(f);
    }
  }

  /**
   * Un-select all
   */
  unSelectAll(): void {
    for (const f of this.selected) {
      f.selected = false;
    }

    this.selected = <[EygleFile]>[];
  }

  /**
   * Download files
   */
  download() {
    if (this.selected.length === 1 && !this.selected[0].directory)
      this.filesService.download(this.selected[0]._id);
    else
      this.filesService.downloadMultiple(_.map(this.selected, (f: EygleFile) => {
        return f._id
      }));
  }
}

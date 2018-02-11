import {Component, OnInit, ViewChild} from '@angular/core';
import {CronService} from "../../../services/cron.service";
import {MatSort, MatTableDataSource} from "@angular/material";
import {CronJob} from "../../../../../commons/core/models/CronJob";
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'ems-cron',
  templateUrl: './cron.component.html',
  styleUrls: ['./cron.component.scss']
})
export class CronComponent implements OnInit {

  /**
   * Table data source
   */
  dataSource: MatTableDataSource<CronJob>;

  /**
   * Table columns
   * @type {string[]}
   */
  displayedColumns = ['job', 'status', 'lastRun', 'scheduleRule', 'actions'];

  /**
   * Is loading data from API
   */
  isLoading: boolean;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public cronService: CronService, private config: ConfigService) {
    this.config.setSettings({
      layout: {
        navbar: true,
        toolbar: false
      }
    });

    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this._refresh();
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /**
   * Get status label
   * @param {} job
   */
  getStatusLabel(job: CronJob) {
    return `ADMIN_PANEL.CRON.STATUS.${job.isRunning ? 'RUNNING' : job.isScheduled ? 'SCHEDULED' : 'UN_SCHEDULED'}`
  }

  /**
   * Run job
   * @param {} job
   */
  run(job: CronJob) {
    this.cronService.run(job)
      .subscribe(() => {
        this._refresh();
      });
  }

  /**
   * Schedule job
   */
  schedule(job: CronJob) {
    this.cronService.schedule(job)
      .subscribe(() => {

      });
  }

  /**
   * Un-schedule job
   * @param {} job
   */
  unSchedule(job: CronJob) {
    this.cronService.unSchedule(job)
      .subscribe(() => {

      });
  }

  /**
   * Refresh list of cron jobs
   * @private
   */
  private _refresh() {
    this.cronService.getAll()
      .subscribe((res: [CronJob]) => {
        this.dataSource.data = res;
        this.isLoading = false;
      });
  }
}

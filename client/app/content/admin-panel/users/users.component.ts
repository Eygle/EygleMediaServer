import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../../services/users.service';
import {MatTableDataSource} from '@angular/material';
import {User} from 'eygle-core/commons/models/User';
import {ConfigService} from 'eygle-core/client/services/config.service';

@Component({
  selector: 'ems-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  /**
   * Table data source
   */
  dataSource: MatTableDataSource<User>;

  /**
   * Table columns
   * @type {string[]}
   */
  displayedColumns = ['email', 'userName', 'roles', 'desc', 'actions'];

  /**
   * Is loading data from API
   */
  isLoading: boolean;

  constructor(private config: ConfigService, private usersService: UsersService) {
    this.config.setSettings({
      layout: {
        navbar: true,
        toolbar: false
      }
    });
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.usersService.getAllAsAdmin()
      .subscribe((res: User[]) => {
        this.dataSource.data = res;
        this.isLoading = false;
      });
  }

  /**
   * Change user rights
   * @param {User} user
   */
  public changeRights(user: User) {
    console.log('change rights', user);
  }

  /**
   * Change user rights
   * @param {User} user
   */
  public edit(user: User) {
    console.log('edit rights', user);
  }

  /**
   * Change user rights
   * @param {User} user
   */
  public delete(user: User) {
    console.log('delete rights', user);
  }
}

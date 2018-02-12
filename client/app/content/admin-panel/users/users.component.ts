import {Component, OnInit} from '@angular/core';
import {ConfigService} from "../../../services/config.service";
import {UsersService} from "../../../services/users.service";

@Component({
  selector: 'ems-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private config: ConfigService, private UsersService: UsersService) {
    this.config.setSettings({
      layout: {
        navbar: true,
        toolbar: false
      }
    });
  }

  ngOnInit() {

  }

}

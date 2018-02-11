import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ConfigService} from "../../services/config.service";

@Component({
  selector: 'ems-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private Auth: AuthService, private config: ConfigService) {
    if (this.Auth.isGuest()) {
      this.config.setSettings({
        layout: {
          navbar: true,
          toolbar: false
        }
      });
    }
  }

  ngOnInit() {
  }

  isGuest() {
    return this.Auth.isGuest();
  }
}

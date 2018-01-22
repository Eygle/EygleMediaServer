import {Component, OnInit} from '@angular/core';

import {MenuItem} from '../models/menu-item';
import {MENU_ITEMS} from './menu-items';

@Component({
  selector: 'ems-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  navItems: MenuItem[] = MENU_ITEMS;

  constructor() {
  }

  ngOnInit() {
  }

}

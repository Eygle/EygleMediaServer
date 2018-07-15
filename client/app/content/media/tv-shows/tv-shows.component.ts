import {Component, OnInit} from '@angular/core';
import {TVShow} from "../../../../../commons/models/TVShow";
import {TvShowsService} from "./tv-shows.service";

@Component({
  selector: 'ems-tv-shows',
  templateUrl: './tv-shows.component.html',
  styleUrls: ['./tv-shows.component.scss']
})
export class TvShowsComponent implements OnInit {

  /**
   * Is page loading
   */
  public isLoading: boolean;

  /**
   * List of movies
   */
  public shows: TVShow[];

  constructor(private showService: TvShowsService) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.showService.getAll<TVShow>()
      .subscribe((res: TVShow[]) => {
        this.isLoading = false;
        this.shows = res;
      });
  }

}

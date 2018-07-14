import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ConfigService} from '../../services/config.service';
import {MoviesService} from "../medias/movies/movies.service";
import {TvShowsService} from "../medias/tv-shows/tv-shows.service";
import {Movie} from "../../../../commons/models/Movie";
import {TVShow} from "../../../../commons/models/TVShow";

@Component({
  selector: 'ems-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /**
   * List of n last movies
   */
  public movies: Movie[];

  /**
   * List of n last tv shows
   */
  public tvShows: TVShow[];

  /**
   * Are components loading
   */
  public areLoading: { movies: boolean, tvShows: boolean };

  constructor(private Auth: AuthService,
              private moviesService: MoviesService,
              private tvShowService: TvShowsService,
              private config: ConfigService) {
    if (this.Auth.isGuest()) {
      this.config.setSettings({
        layout: {
          navbar: true,
          toolbar: false
        }
      });
    }

    this.areLoading = {movies: true, tvShows: true};
  }

  ngOnInit() {
    this.moviesService.getAll(10).subscribe((res: Movie[]) => {
      this.movies = res;
      this.areLoading.movies = false;
    });
    this.tvShowService.getAll(10).subscribe((res: TVShow[]) => {
      this.tvShows = res;
      this.areLoading.tvShows = false;
    });
  }

  isGuest() {
    return this.Auth.isGuest();
  }
}

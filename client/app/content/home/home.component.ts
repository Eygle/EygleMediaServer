import {Component, OnInit} from '@angular/core';
import {NguCarousel} from '@ngu/carousel';
import {MoviesService} from '../media/movies/movies.service';
import {TvShowsService} from '../media/tv-shows/tv-shows.service';
import {Movie} from '../../../../commons/models/Movie';
import {TVShow} from '../../../../commons/models/TVShow';
import {EPermission} from 'eygle-core/commons/core.enums';
import {AuthService} from 'eygle-core/client/services/auth.service';
import {ConfigService} from 'eygle-core/client/services/config.service';

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

  /**
   * Carousels config
   */
  public carousels: NguCarousel;

  constructor(private auth: AuthService,
              private moviesService: MoviesService,
              private tvShowService: TvShowsService,
              private config: ConfigService) {
    if (this.auth.isGuest()) {
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
    if (this.auth.authorize(EPermission.SeeMovies)) {
      this.moviesService.getAll<Movie>(20).subscribe((res: Movie[]) => {
        this.movies = res;
        this.areLoading.movies = false;
      });
    }

    if (this.auth.authorize(EPermission.SeeTVShows)) {
      this.tvShowService.getAll<TVShow>(20).subscribe((res: TVShow[]) => {
        this.tvShows = res;
        this.areLoading.tvShows = false;
      });
    }

    this.carousels = {
      grid: {xs: 1, sm: 3, md: 4, lg: 5, all: 0},
      speed: 400,
      easing: 'ease',
      point: {
        visible: false
      },
      touch: true,
      loop: false,
      custom: 'banner'
    };
  }

  isGuest() {
    return this.auth.isGuest();
  }
}

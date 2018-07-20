import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MoviesService} from '../media/movies/movies.service';
import {TvShowsService} from '../media/tv-shows/tv-shows.service';
import {Movie} from '../../../../commons/models/Movie';
import {TVShow} from '../../../../commons/models/TVShow';
import {EPermission} from 'eygle-core/commons/core.enums';
import {AuthService} from 'eygle-core/client/services/auth.service';
import {ConfigService} from 'eygle-core/client/services/config.service';
import {SlickConfig} from '../../utils/slick-config';

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
   * Slick configuration
   */
  public slickConf: any;

  constructor(private auth: AuthService,
              private moviesService: MoviesService,
              private tvShowService: TvShowsService,
              private config: ConfigService,
              private cdRef: ChangeDetectorRef) {
    this.config.setSettings({
      layout: {
        navbar: true,
        toolbar: !this.auth.isGuest()
      }
    });
    this.areLoading = {movies: true, tvShows: true};
    this.slickConf = SlickConfig.generate(174, 260 + 25 * 2);
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
  }

  /**
   * Is current user a guest
   * @return {boolean}
   */
  public isGuest(): boolean {
    return this.auth.isGuest();
  }
}

import {Component, OnInit} from '@angular/core';
import {MoviesService} from '../movies.service';
import {Crew, Movie} from '../../../../../../commons/models/Movie';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'underscore';
import {EygleFile} from '../../../../../../commons/models/File';
import {SlickConfig} from '../../../../utils/slick-config';
import {ConfigService} from "eygle-core/client/services/config.service";

@Component({
  selector: 'ems-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

  /**
   * Is page loading
   */
  public isLoading: boolean;

  /**
   * Movie
   */
  public movie: Movie;

  /**
   * List of directors
   */
  public directors: Crew[];

  /**
   * List of writers
   */
  public writers: Crew[];

  /**
   * Total size of all files
   */
  public filesSize: number;

  /**
   * Slick conf
   */
  public slickConf: any;

  constructor(private moviesService: MoviesService, private route: ActivatedRoute, config: ConfigService) {
    config.setSettings({layout: {toolbar: true, navbar: true}});
    this.isLoading = true;
    const sidenavNPadding = 260 + 25 * 2;
    // Rest of page width = sidenav + sidenav content padding + internal padding + poster part width
    this.slickConf = SlickConfig.generate(135, sidenavNPadding + 20 * 2 + (window.innerWidth - sidenavNPadding) * .3);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.moviesService.getById<Movie>(id).subscribe((res: Movie) => {
      this.isLoading = false;
      this.movie = res;
      this.directors = _.filter(res.crew, c => {
        return c.job === 'Director';
      });
      this.writers = _.filter(res.crew, c => {
        return c.job === 'Writer';
      });
      this.filesSize = _.reduce(<any>res.files, (s, f: EygleFile) => {
        return s + f.size;
      }, 0);
    });
  }

  public formatDuration() {
    const h = Math.round(this.movie.runtime / 60);
    const m = Math.round((this.movie.runtime % 60));

    return (h ? h + ' h' : '') + (m ? (h ? ' ' : '') + m + ' min' : '');
  }
}

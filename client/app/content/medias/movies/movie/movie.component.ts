import {Component, OnInit} from '@angular/core';
import {MoviesService} from "../movies.service";
import {Crew, Movie} from "../../../../../../commons/models/Movie";
import {ActivatedRoute} from "@angular/router";
import * as _ from "underscore";
import {EygleFile} from "../../../../../../commons/models/File";

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

  constructor(private moviesService: MoviesService, private route: ActivatedRoute) {
    this.isLoading = true;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.moviesService.getById(id).subscribe((res: Movie) => {
      this.isLoading = false;
      this.movie = res;
      this.directors = _.filter(res.crew, c => {
        return c.job === 'Director'
      });
      this.writers = _.filter(res.crew, c => {
        return c.job === 'Writer'
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

  public filterCrew(job: string): Crew[] {
    return _.filter(this.movie.crew, (c: Crew) => {
      console.log(c.name, c.job);
      return c.job === job;
    });
  }
}

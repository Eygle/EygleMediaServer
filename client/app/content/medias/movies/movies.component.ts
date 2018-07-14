import {Component, OnInit} from '@angular/core';
import {MoviesService} from './movies.service';
import {Movie} from '../../../../../commons/models/Movie';

@Component({
  selector: 'ems-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  /**
   * Is page loading
   */
  public isLoading: boolean;

  /**
   * List of movies
   */
  public movies: Movie[];

  constructor(private moviesService: MoviesService) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.moviesService.getAll()
      .subscribe((res: Movie[]) => {
        this.isLoading = false;
        this.movies = res;
      });
  }

}

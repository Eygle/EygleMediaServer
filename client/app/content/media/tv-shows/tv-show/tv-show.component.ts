import * as _ from "underscore";

import {Component, OnInit} from '@angular/core';
import {TVShow} from "../../../../../../commons/models/TVShow";
import {SlickConfig} from "../../../../utils/slick-config";
import {ConfigService} from "eygle-core/client/services/config.service";
import {ActivatedRoute} from "@angular/router";
import {TvShowsService} from "../tv-shows.service";
import {Episode} from "../../../../../../commons/models/Episode";

@Component({
  selector: 'ems-tv-show',
  templateUrl: './tv-show.component.html',
  styleUrls: ['./tv-show.component.scss']
})
export class TvShowComponent implements OnInit {

  /**
   * Is page loading
   */
  public isLoading: boolean;

  /**
   * TVShow
   */
  public tvShow: TVShow;

  public seasons: [{ nbr: number, episodes: Episode[] }];

  /**
   * Slick conf
   */
  public slickConf: any;

  constructor(config: ConfigService, private route: ActivatedRoute, private tvShowsService: TvShowsService) {
    config.setSettings({layout: {toolbar: true, navbar: true}});
    this.isLoading = true;
    const sidenavNPadding = 260 + 25 * 2;
    // Rest of page width = sidenav + sidenav content padding + internal padding + poster part width
    this.slickConf = SlickConfig.generate(135, sidenavNPadding + 20 * 2 + (window.innerWidth - sidenavNPadding) * .3);
    this.seasons = <any>[];
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.tvShowsService.getById<TVShow>(id).subscribe((res: TVShow) => {
      this.isLoading = false;
      this.tvShow = res;

      for (const episode of res.episodesList) {
        let season: any = _.find(this.seasons, s => {
          return s.nbr === episode.season;
        });

        if (!season) {
          season = {nbr: episode.season, episodes: []};
          this.seasons.push(season);
        }

        season.episodes.push(episode);
      }

      console.log(this.seasons);
    });
  }

}

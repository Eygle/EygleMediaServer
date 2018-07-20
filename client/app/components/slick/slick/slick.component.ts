import {AfterContentInit, Component, ContentChild, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ems-slick',
  templateUrl: './slick.component.html',
  styleUrls: ['./slick.component.scss']
})
export class SlickComponent implements OnInit, AfterContentInit {
  /**
   * Slick configuration
   */
  public config: any;

  /**
   * Slick instance
   */
  private _instance: any;

  @Input() itemWidth: number;

  @Input() restOfPageWidth: number;

  @Input() slickConfig: any;

  @ContentChild('content') elemRef: ElementRef;

  constructor() {
  }

  ngOnInit() {
    this.config = {
      dots: false,
      infinite: false,
      arrows: true,
      method: {},
      responsive: this._initResponsive(this.itemWidth, this.restOfPageWidth),
      slidesToScroll: 10,
      slidesToShow: 10,
      speed: 300
    };

    if (this.slickConfig) {
      Object.assign(this.config, this.slickConfig);
    }
  }

  ngAfterContentInit() {
    // treat this.elemRef as a ElementRef type variable and do whatever you want to do with it
  }

  /**
   * Store slick instance
   * @param event
   */
  public init(event) {
    this._instance = event.slick;
  }

  /**
   * Go to previous slide
   */
  public slickPrev() {
    if (this._instance) {
      this._instance.slickPrev();
    }
  }

  /**
   * Go to next slide
   */
  public slickNext() {
    if (this._instance) {
      this._instance.slickNext();
    }
  }

  /**
   * Should disabled next slider for given instance
   * @return {boolean}
   */
  public disableSlideNext() {
    return !this._instance || this._instance.$nextArrow.hasClass('slick-disabled');
  }

  /**
   * Should disabled prev slider for given instance
   * @return {boolean}
   */
  public disableSlidePrev() {
    return !this._instance || this._instance.$prevArrow.hasClass('slick-disabled');
  }

  /**
   * Initialise responsive breakpoints
   * @param itemWidth
   * @param restOfPageWidth
   * @return {any[]}
   * @private
   */
  private _initResponsive(itemWidth, restOfPageWidth) {
    const res = [];

    for (let i = 1; itemWidth * (i + 1) + restOfPageWidth < 5120; i++) { // All the way to 4K screens
      res.push({
        breakpoint: itemWidth * (i + 1) + restOfPageWidth,
        settings: {
          slidesToScroll: i,
          slidesToShow: i
        }
      });
    }

    return res;
  }
}

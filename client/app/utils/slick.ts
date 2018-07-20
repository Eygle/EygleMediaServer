export class Slick {
  public config: any;

  /**
   * Slick instance
   */
  private _instance: any;

  constructor(itemWidth: number, restOfPageWidth: number, conf = null) {
    this.config = {
      dots: false,
      infinite: false,
      arrows: true,
      method: {},
      responsive: this._initResponsive(itemWidth, restOfPageWidth),
      slidesToScroll: 10,
      slidesToShow: 10,
      speed: 300
    };

    if (conf) {
      Object.assign(this.config, conf);
    }
  }

  /**
   * Store slick instance
   * @param event
   * @param slick
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

    for (let i = 1; i <= 20; i++) {
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

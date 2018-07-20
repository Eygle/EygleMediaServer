export class SlickConfig {

  /**
   * Generate slick configuration
   * @param {number} itemWidth
   * @param {number} restOfPageWidth
   * @param {any} conf
   */
  public static generate(itemWidth: number, restOfPageWidth: number, conf = null) {
    return Object.assign({
      dots: false,
      infinite: false,
      arrows: true,
      method: {},
      responsive: this._initResponsive(itemWidth, restOfPageWidth),
      slidesToScroll: 10,
      slidesToShow: 10,
      speed: 300
    }, conf);
  }

  /**
   * Initialise responsive breakpoints
   * @param itemWidth
   * @param restOfPageWidth
   * @return {any[]}
   * @private
   */
  private static _initResponsive(itemWidth, restOfPageWidth) {
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

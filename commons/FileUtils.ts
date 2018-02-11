class FileUtils {

  /**
   * List of video extensions
   * @type {string[]}
   * @private
   */
  private _videoExtensions = ['.avi', '.mkv', '.webm', '.flv', '.vob', '.ogg', '.ogv', '.mov', '.qt',
    '.wmv', '.mp4', '.m4p', '.m4v', '.mpg', '.mp2', '.mpeg', '.mpe', '.mpv'];

  /**
   * List of music extensions
   * @type {string[]}
   * @private
   */
  private _musicExtensions = ['.3gp', '.aa', '.aac', '.aax', '.act', '.aiff', '.wav', '.mp3', '.ogg',
    '.wma', '.flac', '.alac', '.m4a', '.m4p', '.webm'];

  /**
   * List of subtitle extensions
   * @type {string[]}
   * @private
   */
  private _subtitleExtensions = ['.srt', '.sub'];

  /**
   * List of text extensions
   * @type {string[]}
   * @private
   */
  private _textExtensions = ['.txt', '.nfo', '.md'];

  /**
   * Is file extension a video extension
   * @param {string} ext
   * @returns {boolean}
   */
  public isVideo(ext: string) {
    return !!~this._videoExtensions.indexOf(ext);
  }

  /**
   * Is file extension a music extension
   * @param {string} ext
   * @returns {boolean}
   */
  public isMusic(ext: string) {
    return !!~this._musicExtensions.indexOf(ext);
  }

  /**
   * Is file extension a subtitle extension
   * @param {string} ext
   * @returns {boolean}
   */
  public isSubtitle(ext: string) {
    return !!~this._subtitleExtensions.indexOf(ext);
  }

  /**
   * Is file extension a text extension
   * @param {string} ext
   * @returns {boolean}
   */
  public isText(ext: string) {
    return !!~this._textExtensions.indexOf(ext);
  }
}

export default new FileUtils();

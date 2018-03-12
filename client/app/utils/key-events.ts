import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {EKeyCode} from '../typings/client.enums';

@Injectable()
export class KeyEvents {
  /**
   * On press Enter
   */
  onValidate: BehaviorSubject<void>;

  /**
   * On press escape
   */
  onCancel: BehaviorSubject<void>;

  /**
   * On press CTRL + A
   */
  onSelectAll: BehaviorSubject<void>;

  /**
   * On press CTRL + C
   */
  onCopy: BehaviorSubject<void>;

  /**
   * On press CTRL + X
   */
  onCut: BehaviorSubject<void>;

  /**
   * On press CTRL + V
   */
  onPaste: BehaviorSubject<void>;

  /**
   * On press SUPPR
   */
  onDelete: BehaviorSubject<void>;

  /**
   * On press F2
   */
  onRename: BehaviorSubject<void>;

  /**
   * On press CTRL + Z
   */
  onRevert: BehaviorSubject<void>;

  /**
   * On press UP ARROW
   */
  onUp: BehaviorSubject<void>;

  /**
   * On press DOWN ARROW
   */
  onDown: BehaviorSubject<void>;

  /**
   * On press LEFT ARROW
   */
  onLeft: BehaviorSubject<void>;

  /**
   * On press RIGHT ARROW
   */
  onRight: BehaviorSubject<void>;

  /**
   * List of currently pressed keys
   * @type {any[]}
   */
  private _pressed: Array<string> = [];

  /**
   * Is current device a Mac
   * @type {boolean}
   */
  private _isMac = false;

  constructor() {
    this.onValidate = new BehaviorSubject(null);
    this.onCancel = new BehaviorSubject(null);
    this.onSelectAll = new BehaviorSubject(null);
    this.onCopy = new BehaviorSubject(null);
    this.onCut = new BehaviorSubject(null);
    this.onPaste = new BehaviorSubject(null);
    this.onDelete = new BehaviorSubject(null);
    this.onRename = new BehaviorSubject(null);
    this.onRevert = new BehaviorSubject(null);
    this.onUp = new BehaviorSubject(null);
    this.onDown = new BehaviorSubject(null);
    this.onLeft = new BehaviorSubject(null);
    this.onRight = new BehaviorSubject(null);
  }

  /**
   * Is key pressed
   * @param key
   * @returns {boolean}
   */
  public isPressed(key) {
    for (const code of this._pressed) {
      if (key === code) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if CTRL or MAC CMD is pressed to catch shortcuts
   * @returns {boolean}
   */
  public isHoldingCmdKey() {
    if (this._isMac) {
      return this.isPressed(EKeyCode.OSX_L) || this.isPressed(EKeyCode.OSX_R);
    }
    return this.isPressed(EKeyCode.CTRL);
  }

  /**
   * Called when keydown event is triggered
   * This MUST be set and bind to directive key-events
   * @param code
   */
  public setKeyDown(code) {
    switch (code) {
      case EKeyCode.ESCAPE:
        this.onCancel.next(null);
        break;
      case EKeyCode.ENTER:
        this.onValidate.next(null);
        break;
      case EKeyCode.A:
        if (this.isHoldingCmdKey()) {
          this.onSelectAll.next(null);
        }
        break;
      case EKeyCode.C:
        if (this.isHoldingCmdKey()) {
          this.onCopy.next(null);
        }
        break;
      case EKeyCode.X:
        if (this.isHoldingCmdKey()) {
          this.onCut.next(null);
        }
        break;
      case EKeyCode.V:
        if (this.isHoldingCmdKey()) {
          this.onPaste.next(null);
        }
        break;
      case EKeyCode.Z:
        if (this.isHoldingCmdKey()) {
          this.onRevert.next(null);
        }
        break;
      case EKeyCode.F2:
        this.onRename.next(null);
        break;
      case EKeyCode.BACKSPACE:
      case EKeyCode.DELETE:
        this.onDelete.next(null);
        break;
      case EKeyCode.UP:
        this.onUp.next(null);
        break;
      case EKeyCode.DOWN:
        this.onDown.next(null);
        break;
      case EKeyCode.LEFT:
        this.onLeft.next(null);
        break;
      case EKeyCode.RIGHT:
        this.onRight.next(null);
        break;
      case EKeyCode.SHIFT:
      case EKeyCode.CTRL:
      case EKeyCode.ALT:
      case EKeyCode.OSX_R:
      case EKeyCode.OSX_L:
      case EKeyCode.WINDOW_L:
      case EKeyCode.WINDOW_R:
        if (!this.isPressed(code)) {
          this._pressed.push(code);
        }
        break;
    }
  }

  /**
   * Called when keyup event is triggered
   * This MUST be set and bind to directive key-events
   * @param code
   */
  public setKeyUp(code) {
    for (let idx = 0; idx < this._pressed.length; idx++) {
      if (this._pressed[idx] === code) {
        this._pressed.splice(idx, 1);
      }
    }
  }
}

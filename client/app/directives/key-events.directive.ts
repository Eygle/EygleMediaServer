import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: 'emsKeyEvents'
})
export class KeyEventsDirective {

  @Output() onKeyDown: EventEmitter<any> = new EventEmitter();
  @Output() onKeyUp: EventEmitter<any> = new EventEmitter();

  @HostListener('window:keyup', ['$event']) keyUpEvent(event: KeyboardEvent) {
    this.onKeyUp.emit(event.keyCode);
  }

  @HostListener('window:keydown', ['$event']) keyDownEvent(event: KeyboardEvent) {
    this.onKeyDown.emit(event.keyCode);
  }

}

import {
  Directive,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  OnDestroy,
  HostListener
} from "@angular/core";

@Directive({
  selector: "[ngMouseWheel]"
})
export class NgMouseWheelDirective implements OnInit, OnDestroy {
  private instance: any;

  @Output()
  scrollUp: EventEmitter<any> = new EventEmitter();
  @Output()
  scrollDown: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.instance = this.el.nativeElement;
  }

  @HostListener("mousewheel", ["$event"])
  @HostListener("DOMMouseScroll", ["$event"])
  @HostListener("onmousewheel", ["$event"])
  onMouseWheel(event: any) {
    event = window.event || event; // old IE support
    let delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));

    if (delta > 0) {
      this.scrollDown.emit(event);
    }
    if (delta < 0) {
      this.scrollUp.emit(event);
    }
    // for IE
    event.returnValue = false;
    // for Chrome and Firefox
    if (event.preventDefault) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {}
}

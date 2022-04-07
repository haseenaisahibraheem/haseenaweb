import {
  Directive,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef,
  HostListener
} from "@angular/core";

@Directive({
  selector: "[ngTouch]"
})
export class NgTouchDirective implements OnInit, OnDestroy {
  defaultTouch = { x: 0, y: 0, time: 0 };
  private instance: any;

  @Output()
  swipeRight: EventEmitter<any> = new EventEmitter();
  @Output()
  swipeLeft: EventEmitter<any> = new EventEmitter();
  @Output()
  swipeUp: EventEmitter<any> = new EventEmitter();
  @Output()
  swipeDown: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.instance = this.el.nativeElement;
  }
  @HostListener("touchstart", ["$event"])
  //@HostListener('touchmove', ['$event'])
  @HostListener("touchend", ["$event"])
  @HostListener("touchcancel", ["$event"])
  handleTouch(event) {
    let touch = event.touches[0] || event.changedTouches[0];

    // check the events
    if (event.type === "touchstart") {
      this.defaultTouch.x = touch.pageX;
      this.defaultTouch.y = touch.pageY;
      this.defaultTouch.time = event.timeStamp;
    } else if (event.type === "touchend") {
      let deltaX = touch.pageX - this.defaultTouch.x;
      let deltaY = touch.pageY - this.defaultTouch.y;
      let deltaTime = event.timeStamp - this.defaultTouch.time;

      // simulte a swipe -> less than 500 ms and more than 60 px
      if (deltaTime < 500) {
        // touch movement lasted less than 500 ms
        if (Math.abs(deltaX) > 60) {
          // delta x is at least 60 pixels
          if (deltaX > 0) {
            this.swipeRight.emit(event);
          } else {
            this.swipeLeft.emit(event);
          }
        }

        if (Math.abs(deltaY) > 60) {
          // delta y is at least 60 pixels
          if (deltaY > 0) {
            this.swipeDown.emit(event);
          } else {
            this.swipeUp.emit(event);
          }
        }
      }
    }
  }
  ngOnDestroy() {}
}

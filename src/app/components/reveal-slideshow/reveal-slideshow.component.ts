import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { SlideShowService } from "./slide-show.service";

import { TweenMax } from "gsap";
@Component({
  selector: "reveal-slideshow",
  templateUrl: "./reveal-slideshow.component.html",
  styleUrls: ["./reveal-slideshow.component.css"]
})
export class RevealSlideShowComponent implements AfterViewInit {
  touchStartPosition: any;
  constructor(public slideShowService: SlideShowService) {}

  @ViewChild("slideshow", { static: true }) slideshowElem: ElementRef;
  @ViewChild("loader", { static: false }) loader: ElementRef;

  ngAfterViewInit() {
    this.slideShowService.init(this.slideshowElem.nativeElement);
  }

  load() {
    setTimeout(() => {
      // Hide loader panel (animate up)
      TweenMax.to(this.loader.nativeElement, 1, {
        ease: "Quint.easeOut",
        y: "-100%"
      });
      // Set the animations for the slides when the slideshow gets revealed initially (scale up images and animate some of the texts)
      this.slideShowService.load();
    }, 400);
  }

  onScrollUp() {
    this.slideShowService.navigateFn(this.slideShowService.prevSlide);
  }
  onScrollDown() {
    this.slideShowService.navigateFn(this.slideShowService.nextSlide);
  }
}

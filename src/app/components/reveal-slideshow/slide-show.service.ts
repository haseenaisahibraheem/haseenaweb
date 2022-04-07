import { Injectable } from "@angular/core";
import { Slide } from "./slide";

@Injectable()
export class SlideShowService {
  slides: any[] = [];
  slidesTotal: number = this.slides.length;
  current: number = 0;
  currentSlide: Slide;
  nextSlide: Slide;
  prevSlide: Slide;
  isAnimating: boolean;
  DOM: any;

  constructor() {
    this.current = 0;
    this.initEvents();
  }
  init(el: any) {
    this.DOM = { el: el };
    // The slides.
    this.slides = [];
    Array.from(this.DOM.el.querySelectorAll(".slide")).forEach(slideEl =>
      this.slides.push(new Slide(slideEl))
    );

    // The total number of slides.
    this.slidesTotal = this.slides.length;
    // At least 3 slides to continue...
    /*if ( this.slidesTotal < 3 ) {
        return false;
    }*/
    // Current slide position.
    this.current = 0;
    // Set the current/right/left slides.
    // Passing false indicates we dont need to show the revealer (white container that hides the images) on the images.
    this.render(false);
    // Init/Bind events.
    this.initEvents();
  }

  render(hideSlidesBefore: boolean = false) {
    // The current, next, and previous slides.
    this.currentSlide = this.slides[this.current];
    this.nextSlide = this.slides[
      this.current + 1 <= this.slidesTotal - 1 ? this.current + 1 : 0
    ];
    this.prevSlide = this.slides[
      this.current - 1 >= 0 ? this.current - 1 : this.slidesTotal - 1
    ];
    // Set the classes.
    this.currentSlide.setCurrent(hideSlidesBefore);
    this.nextSlide.setRight(hideSlidesBefore);
    this.prevSlide.setLeft(hideSlidesBefore);
  }
  /**
   * Set the animations for the slides when the slideshow gets revealed initially (scale up images and animate some of the texts)
   */
  load() {
    [this.nextSlide, this.currentSlide, this.prevSlide].forEach(slide =>
      slide.load()
    );
  }

  initEvents() {
    for (let slide of this.slides) {
      slide.DOM.imgWrap.addEventListener("click", () => this.navigateFn(slide));
    }
  }

  hideSlides(direction) {
    return this.toggleSlides("hide", direction);
  }

  updateSlides() {
    // Reset current visible slides, by removing the right/left/current and visible classes.
    [this.nextSlide, this.currentSlide, this.prevSlide].forEach(slide =>
      slide.reset()
    );
    // Set the new left/right/current slides and make sure the revealer is shown on top of them (hide its images).
    this.render(true);
  }
  showSlides(direction) {
    return this.toggleSlides("show", direction);
  }
  /**
   * Show/Hide the slides, each with a delay.
   * */

  toggleSlides(action, direction) {
    const delayFactor = 0.2;
    let processing = [];

    [this.nextSlide, this.currentSlide, this.prevSlide].forEach(slide => {
      let delay = slide.isPositionedCenter()
        ? delayFactor / 2
        : direction === "next"
        ? slide.isPositionedRight()
          ? 0
          : delayFactor
        : slide.isPositionedRight()
        ? delayFactor
        : 0;

      processing.push(slide[action](direction, delay));
    });

    return Promise.all(processing);
  }

  navigateFn = slide => {
    if (slide.isPositionedRight()) {
      this.navigate("next");
    } else if (slide.isPositionedLeft()) {
      this.navigate("prev");
    }
  };

  navigate(direction) {
    // If animating return.
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Update current.
    this.current =
      direction === "next"
        ? this.current < this.slidesTotal - 1
          ? this.current + 1
          : 0
        : (this.current =
            this.current > 0 ? this.current - 1 : this.slidesTotal - 1);

    // Hide the current visible slides (left, right and current),
    // then switch and show the new slides.
    this.hideSlides(direction)
      .then(() => this.updateSlides())
      .then(() => this.showSlides(direction))
      .then(() => (this.isAnimating = false));
  }
}

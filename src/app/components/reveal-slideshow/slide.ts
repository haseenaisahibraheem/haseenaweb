import { TweenMax } from "gsap";

export class Slide {
  DOM: any = {};
  config: any = {};
  isCurrent: boolean;
  isRight: boolean;
  isLeft: boolean;

  constructor(el) {
    this.DOM = { el: el };
    this.DOM.imgWrap = this.DOM.el.querySelector(".slide__img-wrap");
    this.DOM.img = this.DOM.imgWrap.querySelector(".slide__img");
    this.DOM.revealer = this.DOM.imgWrap.querySelector(".slide__img-reveal");
    this.DOM.title = this.DOM.el.querySelector(".slide__title");
    //this.DOM.titleBox = this.DOM.title.querySelector(".slide__box");
    this.DOM.titleInner = this.DOM.title.querySelector(".slide__title-inner");
    this.DOM.subtitle = this.DOM.el.querySelector(".slide__subtitle");
    //this.DOM.subtitleBox = this.DOM.subtitle.querySelector(".slide__box");
    this.DOM.subtitleInner = this.DOM.subtitle.querySelector(
      ".slide__subtitle-inner"
    );

    this.DOM.quote = this.DOM.el.querySelector(".slide__quote");
    this.DOM.explore = this.DOM.el.querySelector(".slide__explore");
    // Some config values.
    this.config = {
      revealer: {
        // Speed and ease for the revealer animation.
        speed: { hide: 0.5, show: 0.7 },
        ease: { hide: "Quint.easeOut", show: "Quint.easeOut" }
      }
    };
    // init/bind events.
    this.initEvents();
  }
  initEvents() {
    this.DOM.explore.addEventListener("mouseenter", this.mouseenterFn);
    this.DOM.explore.addEventListener("mouseleave", this.mouseleaveFn);
  }

  mouseenterFn = () => {
    // hover on the "explore" link: scale up the img element.
    if (this.isPositionedCenter()) {
      this.zoom({ scale: 1.2, speed: 2, ease: "Quad.easeOut" });
      /*TweenMax.to(this.DOM.explore.querySelector('.slide__explore-inner'), 0.3, {
          y: '-100%'
      });*/
    }
  };
  mouseleaveFn = () => {
    // hover on the "explore" link: reset the scale of the img element.
    if (this.isPositionedCenter()) {
      this.zoom({ scale: 1.1, speed: 2, ease: "Quad.easeOut" });
      /*TweenMax.to(this.DOM.explore.querySelector('.slide__explore-inner'), 0.3, {
          startAt: {y: '100%'},
          y: '0%'
      });*/
    }
  };

  // set the class current.
  setCurrent(hideBefore = true) {
    this.isCurrent = true;

    if (hideBefore) {
      // Hide the image.
      this.showRevealer({ animation: false });
      // And the texts.
      this.DOM.titleInner.style.opacity = 0;
      this.DOM.subtitleInner.style.opacity = 0;
      this.DOM.explore.style.opacity = 0;
    }

    this.DOM.el.classList.add("slide--current", "slide--visible");
  }
  // Set the class left.
  setLeft(hideBefore = true) {
    this.isRight = this.isCurrent = false;
    this.isLeft = true;
    this.DOM.titleInner.style.opacity = 0;
    this.DOM.subtitleInner.style.opacity = 0;
    this.DOM.explore.style.opacity = 0;
    // Show the revealer and reset the texts that are visible for the left and right slides.
    if (hideBefore) {
      this.resetLeftRight();
    }
    //this.DOM.el.classList.add("slide--left", "slide--visible");
    this.DOM.el.classList.add("slide--left");
  }
  // Set the class right.
  setRight(hideBefore = true) {
    this.isLeft = this.isCurrent = false;
    this.isRight = true;
    this.DOM.titleInner.style.opacity = 0;
    this.DOM.subtitleInner.style.opacity = 0;
    this.DOM.explore.style.opacity = 0;
    // Show the revealer and reset the texts that are visible for the left and right slides.
    if (hideBefore) {
      this.resetLeftRight();
    }
    //this.DOM.el.classList.add("slide--right", "slide--visible");
    this.DOM.el.classList.add("slide--right");
  }
  // Show the revealer and reset the texts that are visible for the left and right slides.
  resetLeftRight() {
    this.showRevealer({ animation: false });
    // Reset texts.
    this.DOM.titleInner.style.opacity = 0;
    this.DOM.titleInner.style.transform = "none";
  }
  // Check if the slide is positioned on the right side (if it´s the next slide in the slideshow).
  isPositionedRight() {
    return this.isRight;
  }
  // Check if the slide is positioned on the left side (if it´s the previous slide in the slideshow).
  isPositionedLeft() {
    return this.isLeft;
  }
  // Check if the slide is the current one.
  isPositionedCenter() {
    return this.isCurrent;
  }
  // Shows the white container on top of the image.
  showRevealer(opts = {}) {
    return this.toggleRevealer("hide", opts);
  }
  // Hides the white container on top of the image.
  hideRevealer(opts = {}) {
    return this.toggleRevealer("show", opts);
  }
  toggleRevealer(action, opts) {
    return new Promise((resolve, reject) => {
      if (opts.animation) {
        TweenMax.to(
          this.DOM.revealer,
          opts.speed || this.config.revealer.speed[action],
          {
            delay: opts.delay || 0,
            ease: opts.ease || this.config.revealer.ease[action],
            startAt:
              action === "hide"
                ? { y: opts.direction === "prev" ? "-100%" : "100%" }
                : {},
            y:
              action === "hide"
                ? "0%"
                : opts.direction === "prev"
                ? "100%"
                : "-100%",
            onComplete: resolve
          }
        );
      } else {
        this.DOM.revealer.style.transform =
          action === "hide"
            ? "translate3d(0,0,0)"
            : `translate3d(0,${
                opts.direction === "prev" ? "100%" : "-100%"
              },0)`;

        resolve();
      }
    });
  }
  // Hide the slide.
  hide(direction, delay) {
    return this.toggle("hide", direction, delay);
  }
  // Show the slide.
  show(direction, delay) {
    return this.toggle("show", direction, delay);
  }
  // Show/Hide the slide.
  toggle(action, direction, delay) {
    // Zoom in/out the image
    this.zoom({
      scale: action === "hide" ? 1.2 : 1.1,
      speed:
        action === "hide"
          ? this.config.revealer.speed[action]
          : this.config.revealer.speed[action] * 2.5,
      ease: this.config.revealer.ease[action],
      startAt: action === "show" ? { scale: 1 } : {},
      delay: delay
    });
    // Hide/Show the slide´s texts.
    if (action === "hide") {
      this.hideTexts(direction, delay);
    } else {
      this.showTexts(direction, delay);
    }
    // Hide/Show revealer on top of the image
    return this[action === "hide" ? "showRevealer" : "hideRevealer"]({
      delay: delay,
      direction: direction,
      animation: true
    });
  }
  hideTexts(direction, delay) {
    this.toggleTexts("hide", direction, delay);
  }
  showTexts(direction, delay) {
    this.toggleTexts("show", direction, delay);
  }
  toggleTexts(action, direction, delay) {
    if (this.isPositionedCenter()) {
      /*this.DOM.titleBox.style.transformOrigin = this.DOM.subtitleBox.style.transformOrigin =
        action === "hide" ? "100% 50%" : "0% 50%";*/

      const speed = action === "hide" ? 0.2 : 0.6;
      const ease = action === "hide" ? "Power3.easeInOut" : "Expo.easeOut";

      TweenMax.to(this.DOM.titleInner, speed, {
        ease: ease,
        delay: action === "hide" ? delay : delay + 0.2,
        startAt: action === "show" ? { y: "-100%" } : {},
        y: action === "hide" ? "100%" : "0%",
        opacity: action === "hide" ? 0 : 1
      });

      /*TweenMax.to(this.DOM.titleBox, speed, {
        ease: ease,
        delay: action === "hide" ? delay + 0.2 : delay,
        startAt: action === "show" ? { scaleX: 0 } : {},
        scaleX: action === "hide" ? 0 : 1,
        opacity: 1
      });*/

      TweenMax.to(this.DOM.subtitleInner, speed, {
        ease: ease,
        delay: action === "hide" ? delay + 0.3 : delay + 0.5,
        startAt: action === "show" ? { y: "-100%" } : {},
        y: action === "hide" ? "100%" : "0%",
        opacity: action === "hide" ? 0 : 1
      });

      /*TweenMax.to(this.DOM.subtitleBox, speed, {
        ease: ease,
        delay: action === "hide" ? delay + 0.5 : delay + 0.3,
        startAt: action === "show" ? { scaleX: 0 } : {},
        scaleX: action === "hide" ? 0 : 1,
        opacity: 1
      });*/

      TweenMax.to(this.DOM.explore, speed, {
        ease: ease,
        delay: delay + 0.2,
        startAt: action === "show" ? { y: "100%" } : {},
        y: action === "hide" ? "-100%" : "0%",
        opacity: action === "hide" ? 0 : 1
      });
    } else {
      TweenMax.to(this.DOM.titleInner, this.config.revealer.speed.hide, {
        ease: "Quint.easeOut",
        delay: delay,
        startAt:
          action === "show"
            ? { y: direction === "next" ? "-50%" : "50%", opacity: 0 }
            : {},
        y: action === "show" ? "0%" : direction === "next" ? "50%" : "-50%",
        opacity: action === "hide" ? 0 : 1
      });
    }
  }
  load() {
    // Scale up the images.
    this.zoom({
      scale: 1.1,
      speed: this.config.revealer.speed["show"] * 2.5,
      ease: this.config.revealer.ease.hide
    });
    // For the current also animate in the "explore" link.
    if (this.isPositionedCenter()) {
      TweenMax.to(this.DOM.explore, this.config.revealer.speed["show"] * 2.5, {
        ease: this.config.revealer.ease.hide,
        startAt: { y: "100%", opacity: 0 },
        y: "0%",
        opacity: 1
      });
    }
  }
  // Zooms in/out the image.
  zoom(opts: any = {}) {
    TweenMax.to(this.DOM.img, opts.speed || 1, {
      startAt: opts.startAt || {},
      delay: opts.delay || 0,
      scale: opts.scale || 1,
      ease: opts.ease || "Quint.easeOut"
    });
  }
  // Reset classes and state.
  reset() {
    this.isRight = this.isLeft = this.isCurrent = false;
    this.DOM.el.classList = "slide";
  }
}

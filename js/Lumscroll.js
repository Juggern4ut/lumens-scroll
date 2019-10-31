class Lumscroll {
  constructor(element, classname, options) {
    this.element = typeof element === "string" ? document.querySelector(element) : element;
    if (!this.element) return false;

    this.classname = classname;
    this.content = this.element.innerHTML;

    this.setDefaultOptions();
    this.createContainer();
    this.createHandle();

    this.element.style.overflow = "hidden";
    this.element.style.position = "relative";
    this.addEventListeners();
  }

  setDefaultOptions() {
    this.scrollTop = 0;
    this.hasFocus = false;

    this.easingFunction = "ease-out";
    this.scrollSpeed = 200;
    this.scrollDistance = 100;
  }

  /**
   * Adds the eventlisteners to the document
   * @returns {void}
   */
  addEventListeners() {
    document.addEventListener("wheel", e => {
      if (this.hasFocus) {
        if (!this.reachedBounds()) {
          e.preventDefault();
        }

        let delta = e.deltaY > 0 ? this.scrollDistance : -this.scrollDistance;
        this.setScrolltop(delta);

        if (!this.reachedBounds()) {
          e.preventDefault();
        }
      }
    });

    this.element.addEventListener("mouseover", e => {
      this.hasFocus = true;
    });

    this.element.addEventListener("mouseout", e => {
      this.hasFocus = false;
    });

    window.addEventListener("resize", () => {
      this.calculateVariables();
      this.setScrolltop(0, true);
    });
  }

  setScrolltop(scrollDelta, quick) {
    if (!this.isScrollable) {
      return false;
    }

    if (quick) {
      this.container.style.transition = `0ms ${this.easingFunction}`;
    }

    this.scrollTop += scrollDelta;
    this.scrollTop = this.scrollTop < 0 ? 0 : this.scrollTop;
    this.scrollTop = this.scrollTop > this.maxScroll ? this.maxScroll : this.scrollTop;

    this.container.style.top = this.scrollTop * -1 + "px";
    this.getScrollPercentage();

    if (quick) {
      setTimeout(() => {
        this.container.style.transition = `${this.scrollSpeed}ms ${this.easingFunction}`;
      }, this.scrollSpeed);
    }
  }

  createContainer() {
    this.container = document.createElement("div");
    this.container.className = this.classname;
    this.container.innerHTML = this.content;
    this.container.style.position = "relative";
    this.container.style.transition = `${this.scrollSpeed}ms ${this.easingFunction}`;
    this.container.style.top = "0";
    this.container.style.display = "inline-block";
    this.container.style.width = "100%";
    this.element.innerHTML = "";
    this.element.append(this.container);

    this.calculateVariables();
  }

  createHandle() {
    this.handleContainer = document.createElement("div");
    this.handleContainer.className = this.classname + "__handle-container";
    this.handleContainer.style.position = "absolute";
    this.handleContainer.style.right = "0";
    this.handleContainer.style.top = "0";

    this.handle = document.createElement("div");
    this.handle.className = this.classname + "__handle";
    this.handle.style.width = "5px";
    this.handle.style.height = "70px";
    this.handle.style.backgroundColor = "rgba(0,0,0,0.3)";
    this.handle.style.position = "absolute";
    this.handle.style.right = "0";
    this.handle.style.top = "0";

    this.handleContainer.append(this.handle);

    this.element.append(this.handleContainer);
  }

  getScrollPercentage() {
    let tmpPercent = this.scrollTop / (this.container.offsetHeight - this.scrollTop);
    let res = (this.scrollTop + this.elementHeight * tmpPercent) / this.container.offsetHeight;

    let percentage = (100 / (this.container.offsetHeight - this.elementHeight)) * this.scrollTop;

    console.log(percentage);
  }

  reachedBounds() {
    return this.scrollTop <= 0 || this.scrollTop >= this.maxScroll;
  }

  calculateVariables() {
    let style = getComputedStyle(this.element);
    this.elementPadding = {
      top: parseInt(style["padding-top"]),
      right: parseInt(style["padding-right"]),
      bottom: parseInt(style["padding-bottom"]),
      left: parseInt(style["padding-left"])
    };

    this.elementHeight = this.element.offsetHeight - (this.elementPadding.top + this.elementPadding.bottom);   
    this.elementWidth = this.element.offsetWidth;
    this.maxScroll = this.container.offsetHeight - this.elementHeight + this.elementPadding.top + this.elementPadding.bottom;
    this.isScrollable = this.maxScroll > this.elementHeight;
  }
}

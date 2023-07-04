import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["centraliseImages", "imageSize", "image"];

  // static values = {
  //   size: { type: Number, default: 500 },
  //   centralise: { type: Boolean, default: true },
  // };

  declare readonly centraliseImagesTarget: HTMLInputElement;
  declare readonly imageSizeTarget: HTMLInputElement;
  declare readonly imageTarget: HTMLImageElement;

  // declare sizeValue: string;
  connect(): void {
    this.imageTarget.dataset.imageSize = "500";
    this.imageSizeTarget.addEventListener("input", this.imageSizeChanged.bind(this));
  }

  imageSizeChanged() {
    this.imageTarget.dataset.imageSize = this.imageSizeTarget.value;
    const redrawEvent = new Event("redraw");

    document.querySelector("#collage")?.dispatchEvent(redrawEvent);
  }

  // sizeValueChanged() {
  //   const redrawEvent = new Event("redraw", {
  //   });

  //   document.querySelector("#collage")?.dispatchEvent(redrawEvent);
  // }

  // centraliseValueChanged() {
  //   const redrawEvent = new Event("redraw", {
  //   });

  //   document.querySelector("#collage")?.dispatchEvent(redrawEvent);
  // }
}

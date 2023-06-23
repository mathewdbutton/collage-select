import { Controller } from "@hotwired/stimulus";
import SelectedImage from "./models/selectedImage";

const ConstrainedImageSize = 500;

export default class extends Controller {
  static targets = ["canvas", "image"];

  declare readonly canvasTarget: HTMLCanvasElement;
  declare readonly imageTargets: HTMLImageElement[];

  redraw() {
    let allSelectedImages = [];

    const images = this.imageTargets;
    allSelectedImages = Array.from(images).sort((a, b) => {
      return parseInt(<string>a.dataset.selectedIndex, 10) - parseInt(<string>b.dataset.selectedIndex, 10);
    });

    const context = this.canvasTarget.getContext("2d");
    if (context === null) return;

    const canvas = this.canvasTarget;
    canvas.width = Math.min(allSelectedImages.length, 2) * ConstrainedImageSize;
    canvas.height = Math.floor((allSelectedImages.length + 1) / 2) * ConstrainedImageSize;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    allSelectedImages.forEach((image: HTMLImageElement, index: number) => {
      const selectedImage = new SelectedImage(image, index);
      if (import.meta.env.DEV) {
        context.strokeRect(
          this.xImageOffset(selectedImage),
          this.yImageOffset(selectedImage),
          ConstrainedImageSize,
          ConstrainedImageSize
        );
      }
      context?.drawImage(
        image,
        this.finalXPosition(selectedImage),
        this.finalYPosition(selectedImage),
        this.aggregateWidth(selectedImage),
        this.aggregateHeight(selectedImage)
      );
    });
  }

  numSelectedImages() {
    return this.imageTargets.length;
  }

  addImage(event: Event) {
    const image = <HTMLImageElement>event.target;
    image.classList.toggle("selected");

    if (image.dataset.selectedIndex == undefined) {
      image.dataset.selectedIndex = (this.numSelectedImages() + 1).toString();
      image.dataset.collageTarget = "image";
    } else {

      delete image.dataset.selectedIndex;
      delete image.dataset.collageTarget;
      this.imageTargets.forEach((image) => {
        const index = image.dataset.selectedIndex;
        if (index === undefined) return;
        const parsedIndex = parseInt(index, 10);
        if ( parsedIndex > this.numSelectedImages()) {
          image.dataset.selectedIndex = (parsedIndex - 1).toString();
        }
      });
    }
    this.redraw();
  }

  downloadCollage() {
    var link = document.createElement("a");
    link.download = "filename.png";
    link.href = this.canvasTarget.toDataURL();
    link.click();
  }

  private xImageOffset(selectedImage: SelectedImage): number {
    return (selectedImage.selectedIndex % 2) * ConstrainedImageSize;
  }

  private yImageOffset(selectedImage: SelectedImage): number {
    return Math.floor(selectedImage.selectedIndex / 2) * ConstrainedImageSize;
  }

  private yImageCentering(selectedImage: SelectedImage): number {
    if (selectedImage.isLandscape) {
      const height = selectedImage.image.naturalHeight * selectedImage.aspectRatio();
      return (ConstrainedImageSize - height) / 2;
    }

    return 0;
  }

  private xImageCentering(selectedImage: SelectedImage): number {
    if (selectedImage.isLandscape) {
      return 0;
    }

    const width = selectedImage.image.naturalWidth * selectedImage.aspectRatio();
    return (ConstrainedImageSize - width) / 2;
  }

  private imageHeight(selectedImage: SelectedImage): number {
    return selectedImage.image.naturalHeight * selectedImage.aspectRatio();
  }

  private imageWidth(selectedImage: SelectedImage): number {
    return selectedImage.image.naturalWidth * selectedImage.aspectRatio();
  }

  private aggregateHeight(image: SelectedImage): number {
    return this.aggregator(image, [this.imageHeight]);
  }

  private aggregator(image: SelectedImage, functions: ((SelectedImage: SelectedImage) => number)[]): number {
    const app = this;
    return functions.reduce((accumulator, currentValue) => accumulator + currentValue.call(app, image), 0);
  }

  private aggregateWidth(image: SelectedImage): number {
    return this.aggregator(image, [this.imageWidth]);
  }

  private finalXPosition(image: SelectedImage): number {
    return this.aggregator(image, [this.xImageOffset, this.xImageCentering]);
  }

  private finalYPosition(image: SelectedImage): number {
    return this.aggregator(image, [this.yImageOffset, this.yImageCentering]);
  }
}

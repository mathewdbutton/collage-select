import { Controller } from "@hotwired/stimulus";
import SelectedImage from "./models/selectedImage";

export default class extends Controller {
  static targets = ["canvas", "image", "numColumns", "centraliseImages", "imageSize"];

  declare readonly canvasTarget: HTMLCanvasElement;
  declare readonly imageTargets: HTMLImageElement[];
  declare readonly numColumnsTarget: HTMLInputElement;
  declare readonly centraliseImagesTarget: HTMLInputElement;
  declare readonly imageSizeTarget: HTMLInputElement;

  connect(): void {
    this.numColumnsTarget.value = "2";
    this.imageSizeTarget.value = "500";
    this.numColumnsTarget.addEventListener("input", () => this.redraw());
    this.centraliseImagesTarget.addEventListener("change", () => this.redraw());
    this.imageSizeTarget.addEventListener("input", () => this.redraw());
  }

  redraw() {
    let allSelectedImages = [];

    const images = this.imageTargets;
    allSelectedImages = Array.from(images).sort((a, b) => {
      return parseInt(<string>a.dataset.selectedIndex, 10) - parseInt(<string>b.dataset.selectedIndex, 10);
    });

    const context = this.canvasTarget.getContext("2d");
    if (context === null) return;

    const canvas = this.canvasTarget;
    canvas.width = Math.min(allSelectedImages.length, this.numColumns()) * this.constrainedImageSize();
    canvas.height = Math.floor((allSelectedImages.length + 1) / 2) * this.constrainedImageSize();
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    allSelectedImages.forEach((image: HTMLImageElement, index: number) => {
      const selectedImage = new SelectedImage(image, index, this.constrainedImageSize());
      if (import.meta.env.DEV) {
        context.strokeRect(
          this.xImageOffset(selectedImage),
          this.yImageOffset(selectedImage),
          this.constrainedImageSize(),
          this.constrainedImageSize()
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

  numSelectedImages(): number {
    return this.imageTargets.length;
  }

  isImagesCentralised(): boolean {
    return this.centraliseImagesTarget.checked;
  }

  constrainedImageSize(): number {
    return parseInt(this.imageSizeTarget.value, 10);
  }

  numColumns(): number {
    return parseInt(this.numColumnsTarget.value, 10);
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
        if (parsedIndex > this.numSelectedImages()) {
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
    return (selectedImage.selectedIndex % this.numColumns()) * selectedImage.imageSize;
  }

  private yImageOffset(selectedImage: SelectedImage): number {
    return Math.floor(selectedImage.selectedIndex / this.numColumns()) * selectedImage.imageSize;
  }

  private yImageCentering(selectedImage: SelectedImage): number {
    if (!this.isImagesCentralised()) {
      return 0;
    }

    const height = selectedImage.image.naturalHeight * selectedImage.aspectRatio();
    return (selectedImage.imageSize - height) / 2;
  }

  private xImageCentering(selectedImage: SelectedImage): number {
    if (!this.isImagesCentralised()) {
      return 0;
    }

    const width = selectedImage.image.naturalWidth * selectedImage.aspectRatio();
    return (selectedImage.imageSize - width) / 2;
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

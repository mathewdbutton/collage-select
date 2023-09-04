import { Controller } from "@hotwired/stimulus";
import SelectedImage from "./models/selectedImage";
import SelectedImageFactory from "./services/selectedImageFactory";

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
    const selectedImageElements = Array.from(this.imageTargets).sort((a, b) => {
      return parseInt(<string>a.dataset.selectedIndex, 10) - parseInt(<string>b.dataset.selectedIndex, 10);
    });

    const selectedImages: SelectedImage[] = selectedImageElements.reduce<SelectedImage[]>((accumulator: SelectedImage[], currentValue, currentIndex) => {
      let isStartOfColumn: boolean = currentIndex % this.numColumns() === 0;
      let previousSelectedImage = accumulator.at(-1)

      let yOffset = 0;
      if (currentIndex + 1 > this.numColumns()) {
        let startOfRowOffset = currentIndex % this.numColumns()
        let previousRow = accumulator.slice(currentIndex - startOfRowOffset - this.numColumns(), currentIndex - startOfRowOffset)
        yOffset = Math.max(...previousRow.map((selectedImage) => selectedImage.height + selectedImage.y))
      }

      let xOffset = 0;
      if (!(isStartOfColumn || (previousSelectedImage === undefined))) {
        xOffset = (previousSelectedImage.x + previousSelectedImage.imageContainerSize) || 0;
      }

      const selectedImage = SelectedImageFactory(
        currentIndex,
        currentValue,
        this.constrainedImageSize(),
        0,
        0,
        xOffset,
        yOffset
      );

      accumulator.push(selectedImage);
      return accumulator;
    }, [])


    const canvasHeight = Math.max(
      ...selectedImages
        .slice(-this.numColumns())
        .map((selectedImage) => selectedImage.y + selectedImage.height)
    );
    const canvasWidth = Math.max(
      ...selectedImages
        .filter((_selectedImage, index) => index % this.numColumns() === 1 || index + 1 === selectedImages.length)
        .map((selectedImage) => selectedImage.x + selectedImage.imageContainerSize)
    );

    const canvas = this.canvasTarget;
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    selectedImages.forEach((image: SelectedImage) => {

      const context = this.canvasTarget.getContext("2d");
      if (context === null) return;

      context?.drawImage(
        image.imageElement,
        image.x + this.xImageCentering(image),
        image.y,
        image.width,
        image.height
      );
     })
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


    return (selectedImage.imageContainerSize - selectedImage.height) / 2;
  }

  private xImageCentering(selectedImage: SelectedImage): number {
    if (!this.isImagesCentralised()) {
      return 0;
    }
    return (selectedImage.imageContainerSize - selectedImage.width) / 2;
  }

  private aggregateHeight(image: SelectedImage): number {
    return this.aggregator(image, []);
  }

  private aggregator(image: SelectedImage, functions: ((SelectedImage: SelectedImage) => number)[]): number {
    const app = this;
    return functions.reduce((accumulator, currentValue) => accumulator + currentValue.call(app, image), 0);
  }

  private aggregateWidth(image: SelectedImage): number {
    return this.aggregator(image, []);
  }

  private finalXPosition(image: SelectedImage): number {
    return this.aggregator(image, [this.xImageCentering]);
  }

  private finalYPosition(image: SelectedImage): number {
    return this.aggregator(image, [this.yImageOffset, this.yImageCentering]);
  }
}

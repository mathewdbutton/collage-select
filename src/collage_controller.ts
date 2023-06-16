import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["canvas"];

  static values = {
    xOffset: Number,
  };

  declare xOffsetValue: number;
  declare readonly canvasTarget: HTMLCanvasElement;

  addImage(a: Event) {
    let allSelectedImages = [];
    const image = <HTMLImageElement>a.target;
    image.classList.toggle("selected");
    if (image.dataset.selectedIndex !== undefined) {
      delete image.dataset.selectedIndex;

      const images = <NodeListOf<HTMLImageElement>>document.querySelectorAll("[data-selected-index]") || [];
      allSelectedImages = Array.from(images).sort((a, b) => {
        return parseInt(<string>a.dataset.selectedIndex, 10) - parseInt(<string>b.dataset.selectedIndex, 10);
      });
    } else {
      const images = <NodeListOf<HTMLImageElement>>document.querySelectorAll("[data-selected-index]") || [];
      image.dataset.selectedIndex = (images.length + 1).toString();

      allSelectedImages = [...Array.from(images), image].sort((a, b) => {
        return parseInt(<string>a.dataset.selectedIndex, 10) - parseInt(<string>b.dataset.selectedIndex, 10);
      });
    }

    const context = this.canvasTarget.getContext("2d");
    if (context === null) return;

    const constrainedImageSize = 500;
    const canvas = this.canvasTarget;
    canvas.width = Math.min(allSelectedImages.length, 2) * constrainedImageSize;
    canvas.height = Math.floor((allSelectedImages.length + 1) / 2) * constrainedImageSize;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    allSelectedImages.forEach((image: HTMLImageElement, index: number) => {

      let xOffsetValue = (index % 2) * constrainedImageSize;
      let yOffsetValue = Math.floor(index / 2) * constrainedImageSize;
      context.strokeRect(xOffsetValue, yOffsetValue, constrainedImageSize, constrainedImageSize);

      if (image.naturalWidth >= image.naturalHeight) {
        const aspectRatio = constrainedImageSize / image.naturalWidth;
        const height = image.naturalHeight * aspectRatio;
        let yCentering = (constrainedImageSize - height) / 2;

        context?.drawImage(
          image,
          xOffsetValue,
          yCentering + yOffsetValue,
          image.naturalWidth * aspectRatio,
          height
        );
      } else {
        const aspectRatio = constrainedImageSize / image.naturalHeight;
        const width = image.naturalWidth * aspectRatio;
        let xCentering = (constrainedImageSize - width) / 2;

        context?.drawImage(
          image,
          xOffsetValue + xCentering,
          yOffsetValue,
          width,
          image.naturalHeight * aspectRatio
        );
      }
    });
  }

  downloadCollage() {
    var link = document.createElement("a");
    link.download = "filename.png";
    link.href = this.canvasTarget.toDataURL();
    link.click();
  }
}

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["canvas"]

  static values = {
    xOffset: Number
  }

  declare xOffsetValue: number
  declare readonly canvasTarget: HTMLCanvasElement;

  addImage(a: Event) {
    let allSelectedImages = [];
    const image = <HTMLImageElement>a.target;
    image.classList.toggle("selected");
    if (image.dataset.selectedIndex !== undefined) {
      delete image.dataset.selectedIndex;

      const images = <NodeListOf<HTMLImageElement>>document.querySelectorAll("[data-selected-index]") || [];
      allSelectedImages = Array.from(images).sort((a, b) => {
        return parseInt(<string> a.dataset.selectedIndex, 10) - parseInt(<string> b.dataset.selectedIndex, 10);
      })
    } else {
      const images = <NodeListOf<HTMLImageElement>>document.querySelectorAll("[data-selected-index]") || [];
      image.dataset.selectedIndex = (images.length + 1).toString();

      allSelectedImages = [...Array.from(images), image].sort((a, b) => {
        return parseInt(<string> a.dataset.selectedIndex, 10) - parseInt(<string> b.dataset.selectedIndex, 10);
      })
    }

    const context = this.canvasTarget.getContext("2d");
    if (context === null) return;

    // Calculate the desired height of the scaled-down image
    const maxHeight = 500;

    // Create a canvas element to draw the scaled-down image onto
    const canvas = this.canvasTarget
    canvas.width = Math.min(allSelectedImages.length,2) * 500;
    canvas.height = (Math.floor((allSelectedImages.length+1)/2)) * 500;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';

  // Draw the scaled-down image onto the canvas

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    allSelectedImages.forEach((image: HTMLImageElement, index: number) => {
      let aspectRatio = 0
      let xCentering = 0
      let yCentering = 0
      let xOffsetValue = ((index) % 2) * 500
      let yOffsetValue = Math.floor(index/2) * 500
      if (image.naturalWidth >= image.naturalHeight) {
        // adjust height
        aspectRatio = 500 / image.naturalWidth;
        const height = image.naturalHeight * aspectRatio
        yCentering = (500 - height)/2
        context?.drawImage(image, xOffsetValue , (0 + yCentering) + yOffsetValue, image.naturalWidth * aspectRatio, height);
      } else {
        // adjust width
        aspectRatio = 500 / image.naturalHeight;
        xCentering = (500 - image.naturalWidth * aspectRatio) / 2
        context?.drawImage(image, xOffsetValue + xCentering , 0 + yOffsetValue, image.naturalWidth * aspectRatio, image.naturalHeight * aspectRatio);
      }
    })
  }

  downloadCollage() {
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = this.canvasTarget.toDataURL()
    link.click();
  }
}

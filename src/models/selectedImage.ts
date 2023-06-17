export default class SelectedImage {
  image: HTMLImageElement;
  selectedIndex: number;
  isLandscape: boolean;
  private constrainedImageSize = 500;

  constructor(image: HTMLImageElement, selectedIndex: number) {
    this.image = image;
    this.selectedIndex = selectedIndex;
    this.isLandscape = this.image.naturalWidth >= this.image.naturalHeight
  }

  aspectRatio() {
    if (this.isLandscape) {
      return this.constrainedImageSize / this.image.naturalWidth;
    } else {
      return this.constrainedImageSize / this.image.naturalHeight;
    }
  }
}

export default class SelectedImage {
  image: HTMLImageElement;
  selectedIndex: number;
  isLandscape: boolean;
  constrainedImageSize: number;

  constructor(image: HTMLImageElement, selectedIndex: number, constrainedImageSize: number) {
    this.image = image;
    this.selectedIndex = selectedIndex;
    this.constrainedImageSize = constrainedImageSize
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

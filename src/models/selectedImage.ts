export default class SelectedImage {
  image: HTMLImageElement;
  selectedIndex: number;
  isLandscape: boolean;
  constrainedImageSize: number;
  imageSize: number ;
  centralise: boolean | null;

  constructor(image: HTMLImageElement, selectedIndex: number, constrainedImageSize: number) {
    this.image = image;
    this.selectedIndex = selectedIndex;
    this.constrainedImageSize = constrainedImageSize
    this.isLandscape = this.image.naturalWidth >= this.image.naturalHeight
    this.imageSize = image.dataset.imageSize !== undefined ? parseInt(image.dataset.imageSize, 10) : constrainedImageSize
    this.centralise = image.dataset.modifyCentralise === "true"
  }

  aspectRatio() {
    if (this.isLandscape) {
      return this.imageSize / this.image.naturalWidth;
    } else {
      return this.imageSize / this.image.naturalHeight;
    }
  }
}

export default class SelectedImage {
  imageElement: HTMLImageElement;
  selectedIndex: number;
  centralise: boolean | null;
  imageContainerSize: number;
  height: number;
  width: number;
  x: number;
  y: number;

  constructor(
    image: HTMLImageElement,
    selectedIndex: number,
    height: number,
    width: number,
    x: number,
    y: number,
    imageContainerSize: number
  ) {
    this.imageElement = image;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y
    this.selectedIndex = selectedIndex;
    this.centralise = image.dataset.modifyCentralise === "true";
    this.imageContainerSize = imageContainerSize
  }


}

import SelectedImage from "../models/selectedImage";

export default (
  selectedIndex: number,
  imageElement: HTMLImageElement,
  constrainedImageSize: number,
  heightChange: number,
  widthChange: number,
  x: number,
  y: number
) => {
  const height = normalisedHeight(imageElement, constrainedImageSize) + heightChange;
  const width = normalisedWidth(imageElement, constrainedImageSize) + widthChange;
  const imageContainerSize = imageSize(imageElement, constrainedImageSize)
  return new SelectedImage(imageElement, selectedIndex, height, width, x, y, imageContainerSize);
};

const aspectRatio = (imageElement: HTMLImageElement, constrainedImageSize: number) => {
  if (isLandscape(imageElement)) {
    return imageSize(imageElement, constrainedImageSize) / imageElement.naturalWidth;
  } else {
    return imageSize(imageElement, constrainedImageSize) / imageElement.naturalHeight;
  }
};

const normalisedWidth = (imageElement: HTMLImageElement, constrainedImageSize: number): number => {
  return imageElement.naturalWidth * aspectRatio(imageElement, constrainedImageSize);
};

const normalisedHeight = (imageElement: HTMLImageElement, constrainedImageSize: number): number => {
  return imageElement.naturalHeight * aspectRatio(imageElement, constrainedImageSize);
};

const isLandscape = (imageElement: HTMLImageElement) =>
  imageElement.naturalWidth >= imageElement.naturalHeight;
  
const imageSize = (imageElement: HTMLImageElement, constrainedImageSize: number): number => {
  return imageElement.dataset.imageSize !== undefined
    ? parseInt(imageElement.dataset.imageSize, 10)
    : constrainedImageSize;
};

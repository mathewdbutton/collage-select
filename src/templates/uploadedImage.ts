export default function ({ src, filename }: { src: string; filename: string }): string {
  return `
  <div data-controller="image">
    <img
      src="${src}"
      class="rounded loaded-image pop"
      alt="${filename}"
      style="width:100px; height:auto"
      data-action="click->collage#addImage"
      data-image-target="image"
      >
      <label for="imageSize" class="basis-1/2"> Image Size </label>
      <input
        data-image-target="imageSize"
        id="imageSize"
        class="basis-1/2 w-full"
        type="number"
        data-collage-target="imageSize"
        step="10"
        value="500"
      />
  </div>
  `;
}

export default function ({ src, filename }: { src: string; filename: string }): string {
  return `
  <img
    src="${src}"
    class="rounded loaded-image pop"
    alt="${filename}"
    style="width:100px; height:auto"
    data-action="click->collage#addImage"
    >
  `;
}

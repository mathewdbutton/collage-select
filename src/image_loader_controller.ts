import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"];

  declare readonly inputTarget: HTMLInputElement;

  connect(): void {
    this.inputTarget.addEventListener('change', () => {
      const files = Array.from(this.inputTarget.files || [])
      this.loadImage(files)
    })
  }

  loadImage(files: Array<File>): void {
    files.forEach((file) => {

      const reader = new FileReader();

      reader.addEventListener(
        "load",
        function (this: FileReader) {
          const image = new Image();

          image.classList.add("rounded")
          image.classList.add("loaded-image")
          image.classList.add("pop")
          image.title = file.name;
          image.style.width = "100px";
          image.style.height = "auto";

          const src = this.result || "";
          if (src instanceof ArrayBuffer) {
            return;
          }
          image.src = src;
          image.dataset.action="click->collage#addImage"


          document.querySelector("#loaded-images")?.appendChild(image);
        },
        false
      );

      reader.readAsDataURL(file);
    });
  };
}

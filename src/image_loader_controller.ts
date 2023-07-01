import { Controller } from "@hotwired/stimulus";
import uploadedImageTemplate from "./templates/uploadedImage";

export default class extends Controller {
  static targets = ["input"];

  declare readonly inputTarget: HTMLInputElement;

  connect(): void {
    this.inputTarget.addEventListener("change", () => {
      const files = Array.from(this.inputTarget.files || []);
      this.loadImage(files);
    });
  }

  loadImage(files: Array<File>): void {
    files.forEach((file) => {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        function (this: FileReader) {
          if (this.result instanceof ArrayBuffer || this.result === null) {
            return;
          }
          const image = uploadedImageTemplate({ src: this.result, filename: file.name });
          document.querySelector("#loaded-images")?.insertAdjacentHTML("beforeend", image);
        },
        false
      );

      reader.readAsDataURL(file);
    });
  }
}

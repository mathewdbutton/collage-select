import "./style.css";
import "./tailwind_styles.css";
import uploadedImageTemplate from "./templates/uploadedImage";

import { Application } from "@hotwired/stimulus";

declare global {
  interface Window {
    Stimulus: Application;
  }
}

import CollageController from "./collage_controller";
import ImageLoader from "./image_loader_controller";
import Image from "./image_controller";

window.Stimulus = Application.start();
window.Stimulus.register("collage", CollageController);
window.Stimulus.register("image-loader", ImageLoader);
window.Stimulus.register("image", Image);

if (import.meta.env.DEV) {
  [
    { result: "./test-images/test.jpg", name: "test" },
    { result: "./test-images/test-2.jpg", name: "test-1" },
    { result: "./test-images/test-3.jpg", name: "test-2" },
  ].forEach((testImage) => {
    const image = uploadedImageTemplate({ src: testImage.result, filename: testImage.name });
    document.querySelector("#loaded-images")?.insertAdjacentHTML("beforeend", image);
  });
}

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
    { result: "./test-images/test-1.jpg", name: "test-1" },
    { result: "./test-images/test-2.jpg", name: "test-2" },
    { result: "./test-images/test-3.jpg", name: "test-3" },
    { result: "./test-images/test-4.jpg", name: "test-4" },
    { result: "./test-images/test-5.jpg", name: "test-5" },
    { result: "./test-images/test-6.jpg", name: "test-6" },
    { result: "./test-images/test-7.jpg", name: "test-7" },
    { result: "./test-images/test-8.jpg", name: "test-8" },
  ].forEach((testImage) => {
    const image = uploadedImageTemplate({ src: testImage.result, filename: testImage.name });
    document.querySelector("#loaded-images")?.insertAdjacentHTML("beforeend", image);
  });
}

import './style.css'
import './tailwind_styles.css'

import { Application } from "@hotwired/stimulus"

declare global {
  interface Window {
    Stimulus: Application;
  }
}

import CollageController from "./collage_controller"
import ImageLoader from "./image_loader_controller"

window.Stimulus = Application.start()
window.Stimulus.register("collage", CollageController)
window.Stimulus.register("image-loader", ImageLoader)

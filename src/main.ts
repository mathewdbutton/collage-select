import './style.css'
import './tailwind_styles.css'

import './image_loader'

import { Application } from "@hotwired/stimulus"

declare global {
  interface Window {
    Stimulus: Application;
  }
}

import CollageController from "./collage_controller"

window.Stimulus = Application.start()
window.Stimulus.register("collage", CollageController)

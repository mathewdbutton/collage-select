export function setupImageLoader(element: HTMLInputElement) {

  const loadImage = (files: Array<File>) => {
    console.log("hey");
    files.forEach((file) => {

      const reader = new FileReader();

      reader.addEventListener(
        "load",
        function (this: FileReader) {
          const image = new Image();

          image.classList.add("rounded")
          image.classList.add("loaded-image")
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

  element.addEventListener('change', () => {
    const files = Array.from(element.files || [])
    loadImage(files)
  })

}
setupImageLoader(document.querySelector<HTMLInputElement>('input#image-loader')!)

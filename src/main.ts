import './style.css'
import { setupImageViewer } from './imageViewer'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>Image Viewer</h1>
    <div class="controls">
      <button id="selectFiles">Select Images</button>
      <button id="selectFolder">Select Folder</button>
    </div>
    <div id="imageGrid" class="image-grid"></div>
  </div>
`

setupImageViewer()
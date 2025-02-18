const { ipcRenderer } = window.require('electron')

export function setupImageViewer() {
  const selectFilesBtn = document.querySelector<HTMLButtonElement>('#selectFiles')!
  const selectFolderBtn = document.querySelector<HTMLButtonElement>('#selectFolder')!
  const imageGrid = document.querySelector<HTMLDivElement>('#imageGrid')!

  selectFilesBtn.addEventListener('click', async () => {
    const files = await ipcRenderer.invoke('select-files')
    displayImages(files)
  })

  selectFolderBtn.addEventListener('click', async () => {
    const folders = await ipcRenderer.invoke('select-folder')
    // TODO: Scan folder for images
    console.log('Selected folders:', folders)
  })

  function displayImages(paths: string[]) {
    imageGrid.innerHTML = ''
    paths.forEach(path => {
      const img = document.createElement('img')
      img.src = `safe-file://${encodeURIComponent(path)}`
      img.classList.add('grid-image')
      
      const container = document.createElement('div')
      container.classList.add('image-container')
      container.appendChild(img)
      
      imageGrid.appendChild(container)
    })
  }
}
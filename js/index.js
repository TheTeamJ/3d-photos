const size = {
  mcgriddles: {
    width: 600,
    height: 800
  },
  coffee: {
    width: 600,
    height: 800
  },
  juice: {
    width: 600,
    height: 800
  },
  ninja: {
    width: 800,
    height: 600
  }
}


function main (name) {
  const container = document.querySelector('.photo')
  const { width, height } = size[name]

  const app = new PIXI.Application({ width, height })
  container.style.width = `${width}px`
  container.style.height = `${height}px`
  container.innerHTML = ''
  container.appendChild(app.view)

  // 写真を表示
  const img = new PIXI.Sprite.from(`photos/raw/${name}.jpg`)
  img.width = width
  img.height = height
  app.stage.addChild(img)

  // 深度マップの読み込み
  const depthMap = new PIXI.Sprite.from(`photos/depth_map/${name}.jpg`)
  depthMap.width = width
  depthMap.height = height
  app.stage.addChild(depthMap)

  const displacementFilter = new PIXI.filters.DisplacementFilter(depthMap)
  app.stage.filters = [displacementFilter]

  let holdMouse = false
  container.onmousedown = function () {
    holdMouse = true
  }
  container.onmouseup = function () {
    displacementFilter.scale.x = 0
    displacementFilter.scale.y = 0
    holdMouse = false
  }
  window.onmouseup = function (event) {
    if (event.target !== container) {
      displacementFilter.scale.x = 0
      displacementFilter.scale.y = 0
      holdMouse = false
    }
  }

  displacementFilter.scale.x = 0
  displacementFilter.scale.y = 0

  container.onmousemove = function (event) {
    if (!holdMouse) return
    displacementFilter.scale.x = (width / 2 - (event.clientX - container.offsetLeft)) / 20
    displacementFilter.scale.y = (height / 2 - (event.clientY - container.offsetTop)) / 20
  }
}

document.getElementById('selector').addEventListener('change', event => {
  main(event.target.value)
})

main('coffee')

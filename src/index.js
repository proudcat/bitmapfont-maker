const fs = require('fs')
const path = require('path')
const glob = require('fast-glob')
const binPack = require('bin-pack')
const sizeOf = require('image-size')
const xmlbuilder = require('xmlbuilder')
const async = require('async')

let $export, $footer

const {
  remote
} = require('electron')

const CODE_MAP = {
  dot: '.',
  点: '.',
  colon: ':',
  冒号: ':',
  semicolon: ';',
  分号: ';',
  percent: '%',
  百分号: '%',
  d_quot: '"',
  双引号: '"',
  s_quot: '\'',
  单引号: '\'',
}

/**
 * input output settings
 */
let settings = {
  src: new Map(), //directories of font images
  bins: null
}

let atlas = {
  font: {
    info: {
      '@face': 'Arial',
      '@size': 32,
      '@bold': 0,
      '@italic': 0,
      '@charset': '',
      '@unicode': 1,
      '@stretchH': 100,
      '@smooth': 1,
      '@aa': 1,
      '@padding': '0,0,0,0',
      '@spacing': '1,1',
      '@outline': 0
    },
    common: {
      '@lineHeight': 32,
      '@base': 26,
      '@scaleW': 256,
      '@scaleH': 256,
      '@pages': 1,
      '@packed': 1,
      '@alphaChnl': 3,
      '@redChnl': 0,
      '@greenChnl': 0,
      '@blueChnl': 0
    },
    pages: {
      page: {
        '@id': 0,
        '@file': 'xxx.png'
      }
    },
    chars: {
      char: [],
      '@count': 5
    }
  }
}

function preview() {

  let canvas = document.getElementById('canvas')
  let ctx = canvas.getContext('2d')
  canvas.width = settings.bins.width
  canvas.height = settings.bins.height
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let promise = new Promise((resolve, reject) => {
    async.each(settings.bins.items, (file, next) => {
      let img = new Image()
      img.onload = function () {
        ctx.drawImage(img, 0, 0, file.width, file.height, file.x, file.y, file.width, file.height)
        next()
      }
      img.src = file.item.path

    }, function (err) {
      if (err) {
        reject()
      } else {
        $export.disabled = false
        resolve()
      }
    })
  })

  return promise
}

function saveXML(dir, name) {

  let filePath = path.join(dir, `${name}.xml`)
  let letters = settings.bins.items

  atlas.font.pages.page['@file'] = `${name}.png`
  atlas.font.info['@face'] = name
  atlas.font.chars.char = []
  atlas.font.chars['@count'] = letters.length

  letters.forEach((e) => {
    let char = {
      '@id': e.item.name.charCodeAt(0),
      '@x': e.x,
      '@y': e.y,
      '@width': e.width,
      '@height': e.height,
      '@xoffset': 0,
      '@yoffset': 0,
      '@xadvance': e.width,
      '@page': 0,
      '@chnl': 15,
      '@letter': e.item.name
    }
    atlas.font.chars.char.push(char)
  })

  let xml = xmlbuilder.create(atlas)

  fs.writeFile(filePath, xml.toString(), 'utf8', function (err) {
    if (err) {
      console.log('save [%s] error %s', filePath, err)
    } else {
      console.log('saved xml ---> ', filePath)
    }
  })
}

function saveImage(dir, name) {

  let canvas = document.getElementById('canvas')

  let base64Data = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '')

  let imagePath = path.join(dir, `${name}.png`)

  fs.writeFile(imagePath, base64Data, 'base64', function (err) {
    if (err) {
      console.log('save [%s] error %s', imagePath, err)
    } else {
      console.log('saved image ---> ', imagePath)
    }
  })
}

function pack() {

  let letters = []

  for (let [dir, images] of settings.src) {
    images.forEach(file => {

      /** path.parse();
      ┌─────────────────────┬────────────┐
      │          dir        │    base    │
      ├──────┬              ├──────┬─────┤
      │ root │              │ name │ ext │
      " C:\      path\dir   \ file  .txt "
      └──────┴──────────────┴──────┴─────┘
      */

      let parsed_file = path.parse(file)
      let dimensions = sizeOf(file)

      letters.push({
        width: dimensions.width,
        height: dimensions.height,
        path: file,
        name: parsed_file.name
      })
    })
  }



  settings.bins = binPack(letters)
}

function importEventHandler() {

  let dirs = remote.dialog.showOpenDialog({
    properties: ['openDirectory', 'multiSelections', 'treatPackageAsDirectory']
  })

  console.log('dir', dirs)

  if (dirs && dirs.length > 0) {

    async.each(dirs, (dir, next) => {

      //bug fast-glob  *.png cannot match ..png file
      let pattern = dir.endsWith('/') ? `${dir}**/\(\.|*).png` : `${dir}/**/(\.|*).png`

      glob(pattern, {
        dot: true
      }).then(files => {
        settings.src.set(dir, files)
        console.log(settings.src.get(dir))
        next()
      }).catch(err => {
        console.error('err', err)
      })

    }, function (err) {
      if (err) {
        console.log('import error', dirs)
      } else {
        $export.disabled = false
        pack()
        preview()
        udpateTree()
      }
    })

    // //bug fast-glob  *.png cannot match ..png file
    // let patterns = dir.map(item => item.endsWith('/') ? `${item}**/\(\.|*).png` : `${item}/**/(\.|*).png`)

    // glob(patterns, {
    //   dot: true
    // }).then(files => {
    //   settings.src.set(dir, files)
    //   console.log(settings.src.get(dir))

    //   pack(files)
    //   preview()
    //   udpateTree()

    //   $export.disabled = false
    // }).catch(err => {
    //   console.error('err', err)
    // })

  } else {
    alert('please select a directory!')
  }
}

function udpateTree() {

  let treeData = []
  for (let [dir, images] of settings.src) {
    let parsed_dir = path.parse(dir)
    let parent = {
      text: parsed_dir.name,
      id: dir,
      icon: 'fa fa-cube',
      selectedIcon: 'glyphicon glyphicon-stop',
      expandIcon: 'fa fa-angle-right',// 展开图标
      collapseIcon: 'fa fa-angle-down',// 收缩图标
      nodes: []
    }

    images.forEach(image => {
      let parsed_image = path.parse(image)

      parent.nodes.push({
        text: parsed_image.name,
        id: image,
        icon: 'circle'
      })
    })

    treeData.push(parent)
  }

}

function exportEventHandler() {

  remote.dialog.showSaveDialog({ title: 'save bitmapfont files' }, (fileName) => {

    let dest = path.parse(fileName)

    saveImage(dest.dir, dest.name)
    saveXML(dest.dir, dest.name)

  })
}

document.addEventListener('DOMContentLoaded', () => {

  window.eval = global.eval = function () {
    throw new Error('Sorry, this app does not support window.eval().')
  }

  let $import = document.getElementById('import')
  $export = document.getElementById('export')
  $footer = document.getElementById('footer')

  $export.disabled = true

  $import.addEventListener('click', importEventHandler)
  $export.addEventListener('click', exportEventHandler)
})
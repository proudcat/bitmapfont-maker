const fs = require('fs')
const path = require('path')
const glob = require('glob')
const pack = require('bin-pack')
const sizeOf = require('image-size')
const xmlbuilder = require('xmlbuilder')
const mkdirp = require('mkdirp')
const async = require('async')

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

function loadImages(files, ctx) {

  let promise = new Promise((resolve, reject) => {
    async.each(files, (file, next) => {
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
        resolve()
      }
    })
  })

  return promise
}

function saveXML(name, dest, bins) {

  let filePath = path.join(dest, `${name}.xml`)

  atlas.font.pages.page['@file'] = `${name}.png`
  atlas.font.info['@face'] = name
  atlas.font.chars.char = []
  atlas.font.chars['@count'] = bins.items.length

  bins.items.forEach((e) => {
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

function output(name, src, dest) {

  let pattern = src.endsWith('/') ? `${src}**/*.png` : `${src}/**/*.png`

  glob(pattern, {
    dot: true
  }, function (err, files) {

    let assets = []

    files.forEach(file => {

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

      assets.push({
        width: dimensions.width,
        height: dimensions.height,
        path: file,
        name: parsed_file.name
      })

    })

    let bins = pack(assets)

    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = bins.width
    canvas.height = bins.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    mkdirp(dest, err => {
      if (err) {
        alert('创建目录失败')
        return
      }

      loadImages(bins.items, ctx).then(() => {

        let base64Data = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '')

        let imagePath = path.join(dest, `${name}.png`)

        fs.writeFile(imagePath, base64Data, 'base64', function (err) {
          if (err) {
            console.log('save [%s] error %s', imagePath, err)
          } else {
            console.log('saved image ---> ', imagePath)
          }
        })
      }).catch(err => {
        console.error('加载图片失败')
      })

      saveXML(name, dest, bins)

    })

  })
}

document.addEventListener('DOMContentLoaded', () => {

  let srcPath = document.getElementById('src')
  let destPath = document.getElementById('dest')
  srcPath.value = path.join(__dirname, '../../', 'example', 'font')
  destPath.value = path.join(__dirname, '../../', 'example', 'export')

  document.getElementById('export').addEventListener('click', () => {
    let src = document.getElementById('src').value
    let dest = document.getElementById('dest').value
    let name = document.getElementById('name').value
    output(name, src, dest)
  })

}, false)

let folder_template =
  `
<li class="folder">
  <span class="folder-title">${title}</span>
  <ul id="xxx">
    <li class="file"><span>部门管理</span> <i class="char" onkeypress="return (this.innerText.length < 1)"
        contenteditable="true">q</i> </li>
    <li class="file"><span>岗位管理</span><i class="char" contenteditable="true">w</i></li>
    <li class="file"><span>用户管理</span><i class="char" contenteditable="true">e</i></li>
  </ul>
</li>
`

function onKeyPress() {

  return this.innerText <= 1

  // this.preventDefault()
}

function createFolder() {

}

function append(data) {

  data

  let folder = `
    <li class="folder">
      <span class="folder-title">${data.key}</span>
      <ul id="${data.path}">

      </ul>
    </li>
    `

  let leaf = `<li class="file"><span>${data.name}</span><i class="char" contenteditable="true">${data.code}</i></li>`




}


module.exports = {
  add: function (data) {

    if (data === null || data === undefined) {
      return
    }

    if (data instanceof Array) {

    } else {

    }

  },
  destroy: function () {
    let $root = document.getElementById('tree')
    while ($root.firstChild) {
      $root.removeChild($root.firstChild)
    }
  }
}
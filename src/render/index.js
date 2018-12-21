
Vue.component('app-header', {
  template: '#header-template',
  methods: {
    add: function () {
      alert('add images')
    },
    save: function () {
      alert('saved')
    }
  }
})

Vue.component('app-center', {
  template: '#center-template',
  methods: {}
})

Vue.component('app-explorer', {
  template: '#explorer-template',
  methods: {}
})


Vue.component('app-content', {
  template: '#content-template',
  methods: {}
})


Vue.component('app-footer', {
  template: '#footer-template',
  methods: {}
})

document.addEventListener('DOMContentLoaded', () => {

  window.eval = function () {
    throw new Error('Sorry, this app does not support window.eval().')
  }

  let dragged
  
  let $splitter = document.getElementById('splitter')

  // $splitter.addEventListener('click', importEventHandler)



  /* 拖动目标元素时触发drag事件 */
  document.addEventListener('drag', function (event) {
    console.log('drag','.....')
  }, false)

  document.addEventListener('dragstart', function (event) {
    // 保存拖动元素的引用(ref.)
    dragged = event.target
    // 使其半透明
    event.target.style.opacity = .5
  }, false)

  document.addEventListener('dragend', function (event) {
    // 重置透明度
    event.target.style.opacity = ''
  }, false)

  /* 放置目标元素时触发事件 */
  document.addEventListener('dragover', function (event) {
    // 阻止默认动作以启用drop
    event.preventDefault()
  }, false)

  document.addEventListener('dragenter', function (event) {
    // 当可拖动的元素进入可放置的目标时高亮目标节点
    if (event.target.className == 'dropzone') {
      event.target.style.background = 'purple'
    }

  }, false)

  document.addEventListener('dragleave', function (event) {
    // 当拖动元素离开可放置目标节点，重置其背景
    if (event.target.className == 'dropzone') {
      event.target.style.background = ''
    }

  }, false)

  document.addEventListener('drop', function (event) {
    // 阻止默认动作（如打开一些元素的链接）
    event.preventDefault()
    // 将拖动的元素到所选择的放置目标节点中
    if (event.target.className == 'dropzone') {
      event.target.style.background = ''
      // dragged.parentNode.removeChild(dragged)
      // event.target.appendChild(dragged)
    }

  }, false)



  var app = new Vue({
    el: '#app',
    data: {
      todos: [{
        text: '学习 JavaScript'
      },
      {
        text: '学习 Vue'
      },
      {
        text: '整个牛项目'
      }
      ]
    }
  })

})
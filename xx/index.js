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

  // Vue.use(window.VueDragZone)

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
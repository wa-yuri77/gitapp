const app = Vue.createApp({
  data() {
    return {
//デフォルトはモーダルウィンドウを閉じる
    show: false,
    path: '/Users/shoichiro-u/Desktop/Vue-dustbox/dustbox.gif'
    }
  },
  methods:{
//モーダルウィンドウを開く要素をクリックしたら
    open: function(){
      this.show = true
      this.path = '/Users/shoichiro-u/Desktop/Vue-dustbox/graph.gif';
    },
    open2: function(){
      this.show = true
      this.path2 = '/Users/shoichiro-u/Desktop/Vue-dustbox/graph.gif';
    },
//モーダルウィンドウを閉じる要素をクリックしたら
    close: function(){
      this.show = false
      this.path = '/Users/shoichiro-u/Desktop/Vue-dustbox/dustbox.gif';
    },
  }
});
app.mount("#app");
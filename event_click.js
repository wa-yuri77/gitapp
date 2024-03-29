const app = Vue.createApp({
  data() {
    return {
//デフォルトはモーダルウィンドウを閉じる
    show: false,
    path: 'https://github.com/wa-yuri77/gitapp/blob/main/dustbox.gif?raw=true'
    }
  },
  methods:{
//モーダルウィンドウを開く要素をクリックしたら
    open: function(){
      window.location.href = "https://main.d2v7gdb6u9dfdx.amplifyapp.com/";
    },
    open2: function(){
      this.show = true
      this.path2 = 'https://github.com/wa-yuri77/gitapp/blob/main/graph.gif?raw=true';
    },
//モーダルウィンドウを閉じる要素をクリックしたら
    close: function(){
      this.show = false
      this.path = 'https://github.com/wa-yuri77/gitapp/blob/main/dustbox.gif?raw=true';
    },
  }
});
app.mount("#app");
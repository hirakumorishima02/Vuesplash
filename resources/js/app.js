import Vue from 'vue'
// ルーティングの定義をインポートする
import router from './router'
// ルートコンポーネントをインポートする
import App from './App.vue'
import store from './store'
import './bootstrap'

const createApp = async () => {
  // アプリ起動時にユーザー情報を取得するアクションを行う
  await store.dispatch('auth/currentUser')

  new Vue({
    el: '#app',
    router, // ルーティングの定義を読み込む
    store, //indexで定義したVuexのstate,getters,mutations,actionsをvueインスタンス作成時に読み込む
    components: { App }, // ルートコンポーネントの使用を宣言する
    template: '<App />' // ルートコンポーネントを描画する
  })
  
}

// 上記でユーザー情報の取得・Vueインスタンスの生成などをまとめたcreateApp()メソッドを発動する
// これを発動しなければアプリが生成されないため、注意
createApp()
<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main>
      <div class="container">
        <!--Message.vueが表示される場所-->
        <Message />
          <!--<RouterView />がコンポーネントツリーの頂上。-->
         <!--<RouterView />に他のコンポーネントが入る形となる-->
        <RouterView />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
// componentsディレクトリに作ったコンポーネントを読み込み
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { INTERNAL_SERVER_ERROR } from './util' //util.jsの INTERNAL_SERVER_ERRORをインポート
import Message from './components/Message.vue'

export default {
  components: {
    Navbar,
    Footer,
    Message,
  },
  computed: {
    errorCode () { //storeのstateを参照するメソッド
      return this.$store.state.error.code
    }
  },
  watch: {　//storeのstateを参照するメソッドを実行して監視
    errorCode: { 
      handler (val) {
        if (val === INTERNAL_SERVER_ERROR) {
          this.$router.push('/500')
        }
      },
      immediate: true
    },
    $route () {
      this.$store.commit('error/setCode', null)
    }
  }
}
</script>
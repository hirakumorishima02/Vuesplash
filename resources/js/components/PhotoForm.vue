<template>
  <div v-show="value" class="photo-form">
    <h2 class="title">Submit a photo</h2>
    <div v-show="loading" class="panel">
      <Loader>Sending your photo...</Loader>
    </div>
    <form v-show="! loading" class="form" @submit.prevent="submit">
      <div class="errors" v-if="errors">
        <ul v-if="errors.photo">
          <li v-for="msg in errors.photo" :key="msg">{{ msg }}</li>
        </ul>
      </div>
      <input class="form__item" type="file" @change="onFileChange">
      <output class="form__output" v-if="preview">
        <img :src="preview" alt="">
      </output>
      <div class="form__button">
        <button type="submit" class="button button--inverse">submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import { CREATED, UNPROCESSABLE_ENTITY } from '../util' //バリデーションエラーのコードをインポート
import Loader from './Loader.vue'

export default {
  components: {
    Loader
  },
//value を受け取れるようにスクリプトブロックに props を追加
  props: {
    //表示 / 非表示を真偽値で表現するため Boolean 型と定義
    value: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
        loading: false,
        preview: null,
        photo: null, //選択中のファイルを格納する
        errors: null, //エラーメッセージを格納する
    }
  },
  methods: {
    // フォームでファイルが選択されたら実行される
    onFileChange (event) {
      // 何も選択されていなかったら処理中断
      if (event.target.files.length === 0) {
        this.reset()
        return false
      }

      // ファイルが画像ではなかったら処理中断
      if (! event.target.files[0].type.match('image.*')) {
        this.reset()
        return false
      }

      // FileReaderクラスのインスタンスを取得
      const reader = new FileReader()

      // ファイルを読み込み終わったタイミングで実行する処理
      reader.onload = e => {
        // previewに読み込み結果（データURL）を代入する
        // previewに値が入ると<output>につけたv-ifがtrueと判定される
        // また<output>内部の<img>のsrc属性はpreviewの値を参照しているので
        // 結果として画像が表示される
        this.preview = e.target.result
      }

      // ファイルを���み込む
      // 読み込まれたファイルはデータURL形式で受け取れる（上記onload参照）
      reader.readAsDataURL(event.target.files[0])
      
      this.photo = event.target.files[0] //dataのphotoにファイルを代入するための記述
    },
      // 入力欄の値とプレビュー表示をクリアするメソッド
      reset () {
        this.preview = ''
        this.photo = null //photo自体もresetメソッドで削除
        // $elはこのコンポーネント自体を指すもの
        this.$el.querySelector('input[type="file"]').value = null
      },
      async submit () {
        // Loadingウィンドウを表示するためにtrueにする
        this.loading = true
        
        // AJAXでファイルを送信するためのFormDataAPIを使用している
        //慣用的な FormData のユースケースなので覚えておきたい
        const formData = new FormData()
        formData.append('photo', this.photo)
        const response = await axios.post('/api/photos', formData)
        
        // ファイルアップロードが終わったらLoadingウィンドウを閉じるためにfalseにする
        this.loading = false
        
        if (response.status === UNPROCESSABLE_ENTITY) {
            this.errors = response.data.errors
        // バリデーションエラーの場合はエラーメッセージを表示する関係から、値をクリアしたりフォームを閉じない
        // return fasleでアップロードの処理を中断
        return false
        }

        // 送信完了後にreset()で入力値をクリアする
        this.reset()
        // inputイベントを発行して自動的にフォームが閉じるようにしている
        // イベントとともにfalseが発行されるため、NavbarのshowFormがfalseとなり、<PhotoForm>のv-showがfalseとなるためsubmitウィンドウが閉じられる
        this.$emit('input', false)
        
        if (response.status !== CREATED) {
            this.$store.commit('error/setCode', response.status)
        return false
        }
        

        
        this.$router.push(`/photos/${response.data.id}`)
      },
  }
}

</script>
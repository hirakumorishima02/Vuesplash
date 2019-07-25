import { OK, CREATED, UNPROCESSABLE_ENTITY } from '../util' //util.jsで定義したエラー変数をインポート

const state = {
  user: null,
  apiStatus: null, //APIが成功したかどうかを表す。成功の可否でその後の処理を行うかを決める。
  loginErrorMessages: null, //エラーメッセージを入れるためのステート
  registerErrorMessages: null //上に同じ
}

const getters = {
  // ログインチェック
  check: state => !! state.user,
  // ログインユーザーの名前を算出。なくてもnullが返ってこないように空文字を入れている
  username: state => state.user ? state.user.name : ''
}

const mutations = {
  //user ステートの値を更新する。
  // ミューテーションのメソッドの第一引数は必ずstateであること！
  // 実引数は第二引数以降からしか読み込まれないことに注意
  setUser(state,user) {
    state.user = user
  },
  setApiStatus (state, status) {
    state.apiStatus = status
  },
  setLoginErrorMessages (state, messages) {
    state.loginErrorMessages = messages
  },
  setRegisterErrorMessages (state, messages) {
    state.registerErrorMessages = messages
  }
}

const actions = {
  // 会員登録
  // アクションのメソッドの第一引数は必ずcontextであること！
  // contextの中にはmutationsを呼び出すためのcommitメソッドが入っているため必須
  async register (context, data) {
    context.commit('setApiStatus', null)
    const response = await axios.post('/api/register', data)

    if (response.status === CREATED) {
      context.commit('setApiStatus', true)
      context.commit('setUser', response.data)
      return false
    }

    context.commit('setApiStatus', false)
    if (response.status === UNPROCESSABLE_ENTITY) {
      context.commit('setRegisterErrorMessages', response.data.errors)
    } else {
      context.commit('error/setCode', response.status, { root: true })
    }
  },
  //ログイン
  async login (context, data) {
    context.commit('setApiStatus', null)
    // API 通信が成功した場合も失敗した場合も response にレスポンスオブジェクトを代入
    const response = await axios.post('/api/login', data)
    // responseに代入されたエラーの中身によってその後の結果(apiAtatusの中身)を分岐させている。
      if (response.status === OK) {
        context.commit('setApiStatus', true) //成功すれば（responseの中身がOKなら）true
        context.commit('setUser', response.data)
        return false
      }
    context.commit('setApiStatus', false) // 失敗だったらfalse
      if (response.status === UNPROCESSABLE_ENTITY) { //バリデーションエラーの際の分岐
        context.commit('setLoginErrorMessages', response.data.errors)
      } else { //それ以外のエラーの場合の分岐
        context.commit('error/setCode', response.status, { root: true })
      }
  },
  // ログアウト
  async logout (context) {
    context.commit('setApiStatus', null)
    const response = await axios.post('/api/logout')

    if (response.status === OK) {
      context.commit('setApiStatus', true)
      context.commit('setUser', null)
      return false
    }

    context.commit('setApiStatus', false)
    context.commit('error/setCode', response.status, { root: true })
  },
  // ログインユーザーチェック
  async currentUser (context) {
    context.commit('setApiStatus', null)
    // apiでルーティング定義したAuthのuser情報を入れる。ログインしていなければnullを返す
    const response = await axios.get('/api/user')
    const user = response.data || null
    // setUserメソッドを使用してuser情報を得る
      if (response.status === OK) {
        context.commit('setApiStatus', true)
        context.commit('setUser', user)
        return false
    }
    context.commit('setApiStatus', false)
    context.commit('error/setCode', response.status, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
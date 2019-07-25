// 写真投稿が完了したメッセージを表示するためのモジュール
const state = {
  content: ''
}

const mutations = {
  setContent (state, { content, timeout }) {
    state.content = content

    if (typeof timeout === 'undefined') {
      timeout = 3000
    }

    setTimeout(() => (state.content = ''), timeout)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
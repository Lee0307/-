import {reqseckList} from "../../utils/http"
const state = {
    // 分类list
    list: []
}
const mutations = {
    // 修改list
    changeList(state, arr) {
        state.list = arr;
    }
}
const actions = {
    // 发起请求
    reqList(context){
        // 发起请求，成功之后，修改list
        reqseckList().then(res=>{
            context.commit("changeList",res.data.list)
        })
    }
}
const getters = {
    list(state){
        return state.list
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}


import { useDynamicTitle } from '@/utils/dynamicTitle'

const actions = {
    // 设置网页标题
    setTitle({ commit }, title) {
        state.title = title
        useDynamicTitle();
    }
}
export default {
    namespaced: true,
    actions
}
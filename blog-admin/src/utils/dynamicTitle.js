import store from '@/store'

/**
 * 动态修改标题
 */
export function useDynamicTitle() {
  if (store.state.settings.dynamicTitle) {
    document.title = store.state.settings.title + ' - 博客系统';
  } else {
    document.title = '博客系统';
  }
}
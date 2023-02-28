/*
 * @Author: zhicheng ran
 * @Date: 2023-02-22 16:15:56
 * @LastEditTime: 2023-02-28 16:55:37
 * @FilePath: \pic-processing\test\index.ts
 * @Description:
 */
import { PicProcessor, OpenCV } from '../src'
import Vue from 'vue/types/umd'
import { debounce } from 'lodash'
const vue = new (
  window as {
    Vue: typeof Vue
  }
).Vue({
  el: '#app',
  setup(props, ctx) {
    const state = (window.Vue as any).reactive({
      config: {
        content: '',
        rotate: 0,
        scale: 1,
        horizontalMirror: false,
        verticalMirror: false,
      },
      pic: '',
      processor: new PicProcessor(),
      loading: false,
    })
    const fn = debounce(async () => {
      if (state.config.content) {
        state.loading = true
        const { config, processor } = state
        const util = await processor.render(config)
        const blob = await util.toBlob()
        state.pic = URL.createObjectURL(blob)
        state.loading = false
      }
    }, 500)
    ;(window.Vue as any).watch(state.config, () => fn(), {
      deep: true,
    })
    async function handleFileChange(e: any) {
      const file = e.target!.files[0]
      state.config.content = file
    }
    return {
      state,
      handleFileChange,
    }
  },
})
console.log(vue)

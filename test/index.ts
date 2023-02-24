/*
 * @Author: zhicheng ran
 * @Date: 2023-02-22 16:15:56
 * @LastEditTime: 2023-02-24 17:18:17
 * @FilePath: \pic-processing\test\index.ts
 * @Description:
 */
import { PicProcessor, OpenCV } from '../src'

const vue = new (window as any).Vue({
  el: '#app',
  data: {
    config: {
      content: undefined,
      rotate: 0,
      scale: 1,
    },
    pic: '',
    processor: new PicProcessor(),
  },
  methods: {
    async handleFileChange(e: any) {
      const file = e.target!.files[0]
      ;(this as any).config.content = file
    },
  },
  watch: {
    config: {
      async handler() {
        const { config, processor } = this as any
        ;(this as any).pic = (
          await (processor as PicProcessor).render(config)
        ).base64
      },
      deep: true,
    },
  },
})
console.log(vue)

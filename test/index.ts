/*
 * @Author: zhicheng ran
 * @Date: 2023-02-22 16:15:56
 * @LastEditTime: 2023-02-24 17:28:30
 * @FilePath: \pic-processing\test\index.ts
 * @Description:
 */
import { PicProcessor, OpenCV } from '../src'
import Vue from 'vue'
const vue = new (
  window as {
    Vue: typeof Vue
  }
).Vue({
  el: '#app',
  data: {
    config: {
      content: '',
      rotate: 0,
      scale: 1,
    },
    pic: '',
    processor: new PicProcessor(),
  },
  methods: {
    async handleFileChange(e: any) {
      const file = e.target!.files[0]
      this.config.content = file
    },
  },
  watch: {
    config: {
      async handler() {
        if (this.config.content) {
          const { config, processor } = this
          this.pic = (
            await (processor as PicProcessor).render(config)
          ).base64
        }
      },
      deep: true,
    },
  },
})
console.log(vue)

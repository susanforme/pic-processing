/*
 * @Author: zhicheng ran
 * @Date: 2023-02-22 16:15:56
 * @LastEditTime: 2023-02-22 17:22:56
 * @FilePath: \pic-processing\test\index.ts
 * @Description:
 */
import { PicProcessor, OpenCV } from '../src'
let data: string
const file = document.getElementById(
  'file'
) as HTMLInputElement
file.addEventListener('change', async (e: any) => {
  const file = e.target!.files[0]
  const pic = new PicProcessor({
    content: file,
  })
  data = await pic.render()
  console.log(pic, data)
})
const btn = document.getElementById(
  'btn'
) as HTMLButtonElement
const output = document.getElementById(
  'output'
) as HTMLImageElement
btn.addEventListener('click', async () => {
  output.src = data
})

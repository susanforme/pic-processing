import { Utils } from '../utils'

export class PicProcessor {
  /**
   * @description Configuration for the PicProcessor class
   */
  #config: Required<PicProcessorConfig>
  #width = 0
  #height = 0
  #imgBlob = new Blob()
  /**
   * @param  config for the PicProcessor class
   */
  constructor(config: PicProcessorConfig) {
    this.#config = this.#addDefaultConfig(config)
  }
  /**
   * @description Renders the image
   * @param config Configuration for the PicProcessor class
   */
  async render(config?: PicProcessorConfig) {
    if (config) {
      this.#config = this.#addDefaultConfig(config)
    }
    await this.#init()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = this.#width
    canvas.height = this.#height
    const bitmap = await window.createImageBitmap(
      this.#imgBlob
    )
    ctx.drawImage(bitmap, 0, 0)
    const base64 = canvas.toDataURL()
    return {
      base64,
      // blob: await this.#canvasToBlob(canvas),
    }
  }
  /**
   *
   */
  #canvasToBlob(canvas: HTMLCanvasElement) {
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        blob => {
          resolve(blob!)
        },
        // only support png because of canvas not support gif
        'image/png',
        1
      )
    })
  }
  /**
   * @description Returns the loaded image
   */
  #getImg() {
    return new Promise(
      (
        resolve: (
          value: [HTMLImageElement, () => void]
        ) => void,
        reject
      ) => {
        const img = new Image()
        img.src = URL.createObjectURL(this.#imgBlob)
        img.style.visibility = 'hidden'
        img.style.position = 'absolute'
        document.body.appendChild(img)
        img.onload = () => {
          resolve([
            img,
            () => {
              document.body.removeChild(img)
              URL.revokeObjectURL(img.src!)
            },
          ])
        }
        img.onerror = error => {
          reject(error)
        }
      }
    )
  }
  /**
   * @description Initializes the PicProcessor class
   */
  #init() {
    return new Promise((resolve, reject) => {
      const config = this.#config
      const { content } = config
      if (content instanceof File) {
        this.#imgBlob = Utils.fileToBlob(content)
      } else if (content instanceof Blob) {
        this.#imgBlob = content
      } else if (typeof content === 'string') {
        try {
          this.#imgBlob = Utils.b64toBlob(content)
        } catch (error) {
          throw new Error('Invalid Base64 String')
        }
      } else {
        throw new Error('Invalid content')
      }
      this.#getImg()
        .then(([img, uninstall]) => {
          this.#width = img.width
          this.#height = img.height
          uninstall()
          resolve(true)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  #addDefaultConfig(
    config: PicProcessorConfig
  ): Required<PicProcessorConfig> {
    return {
      scale: 1,
      isTransparency: true,
      ...config,
    }
  }
}

/**
 * @description Configuration for the PicProcessor class
 */
export type PicProcessorConfig = {
  /**
   * @description is the image background transparent
   */
  isTransparency?: boolean
  /**
   * @description Accepts a valid base64, blob,or file image
   */
  content: string | Blob | File
  /**
   * @description The scale of the image
   * @default 1
   */
  scale?: number
}

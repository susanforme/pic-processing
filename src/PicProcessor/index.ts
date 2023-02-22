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
    const img = new Image()
    img.src = URL.createObjectURL(this.#imgBlob)
    ctx.drawImage(
      img,
      0,
      0,
      this.#width * this.#config.scale,
      this.#height * this.#config.scale
    )
    const base64 = canvas.toDataURL()
    return base64
  }
  /**
   * @description Initializes the PicProcessor class
   */
  #init() {
    return new Promise((resolve, reject) => {
      const config = this.#config
      const { content } = config
      const img = new Image()
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
      img.src = URL.createObjectURL(this.#imgBlob)
      document.body.appendChild(img)
      img.onload = () => {
        this.#width = img.width
        this.#height = img.height
        // revoke the object URL
        window.URL.revokeObjectURL(img.src!)
        document.body.removeChild(img)
        resolve(true)
      }
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

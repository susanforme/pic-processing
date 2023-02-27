import { Utils } from '../utils'

export class PicProcessor {
  /**
   * @description Configuration for the PicProcessor class
   */
  #config: Config | null = null
  #width = 0
  #height = 0
  #imgBlob = new Blob()
  /**
   * @param  config for the PicProcessor class
   */
  constructor(config?: PicProcessorConfig) {
    if (config)
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
    if (this.#config === null)
      throw new Error('you must provide a config')
    await this.#init()
    const { isTransparency } = this.#config
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const bitmap = await window.createImageBitmap(
      this.#imgBlob
    )
    // canvas.width = Math.max(this.#width, this.#height)
    // scale the canvas
    this.#scaleCanvas(canvas)
    // rotate the canvas
    this.#rotateCanvas(canvas)

    ctx.drawImage(bitmap, 0, 0)

    return this.#generateFn(canvas)
  }
  #generateFn(canvas: HTMLCanvasElement) {
    return {
      toBlob() {
        return Utils.canvasToBlob(canvas)
      },
      async toBase64() {
        return canvas.toDataURL()
      },
    }
  }
  /**
   * @description scale the canvas
   */
  #scaleCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!
    const { scale } = this.#config!
    canvas.width = this.#width * scale.X
    canvas.height = this.#height * scale.Y
    // maybe change the center
    ctx.scale(scale.X, scale.Y)
  }
  /**
   * @description rotate the canvas
   */
  #rotateCanvas(canvas: HTMLCanvasElement) {
    const { rotate } = this.#config!
    const ctx = canvas.getContext('2d')!
    // move the canvas to the center
    const center = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    }
    ctx.translate(center.x, center.y)
    // rotate the canvas
    ctx.rotate((rotate * Math.PI) / 180)
    // move the canvas back
    ctx.translate(-center.x, -center.y)

    // 并未在中心?
    // 最长边画圆形
    // swap
    // if (rotate !== 0) {
    //   const width = canvas.width
    //   canvas.width = canvas.height
    //   canvas.height = width
    // }
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
      const config = this.#config!
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
  #addDefaultConfig(config: PicProcessorConfig): Config {
    let scale: Coord = {
      X: 1,
      Y: 1,
    }
    let rotate = 0
    // init scale
    if (typeof config.scale === 'number') {
      scale = {
        X: config.scale,
        Y: config.scale,
      }
    } else if (typeof config.scale === 'object') {
      scale = config.scale
    }
    // init rotate
    if (rotate > 360) {
      rotate = rotate % 360
    }
    if (rotate <= 360) {
      if (rotate === 360 || rotate === 180) {
        rotate = 0
      } else if (rotate < 0) {
        rotate = 360 + rotate
      }
    }
    return {
      isTransparency: true,
      rotate: 0,
      ...config,
      scale,
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
  scale?: number | Coord
  /**
   * @description The rotation of the image
   * @default 0
   */
  rotate?: number
}

/**
 * @description The transformed configuration
 */
type Config = Required<
  Omit<PicProcessorConfig, 'scale'>
> & {
  scale: Coord
}

/**
 * @description the coord
 */
type Coord = {
  X: number
  Y: number
}

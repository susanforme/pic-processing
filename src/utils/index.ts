export class Utils {
  /**
   * @description Returns the base64 string of the image
   * @param  imgBlob Image blob
   */
  static getBase64(imgBlob: Blob): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsDataURL(imgBlob)
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
    })
  }
  /**
   * @description Returns the image blob
   * @param  base64 Image base64 string
   */
  static b64toBlob(base64: string) {
    const byteString = window.atob(base64.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: 'image/jpeg' })
  }
  static fileToBlob(file: File) {
    return new Blob([file], { type: 'image/jpeg' })
  }
}

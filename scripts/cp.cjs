/*
 * @Author: zhicheng ran
 * @Date: 2023-02-22 15:18:28
 * @LastEditTime: 2023-02-22 16:03:09
 * @FilePath: \pic-processing\scripts\cp.cjs
 * @Description: copy dist file to node_modules
 */

const fse = require('fs-extra')
const fs = require('fs/promises')
const path = require('path')

// 获取打包后文件根目录路径
const BASE_DIST_PATH_URL = path.resolve(__dirname, '../')

/**
 * 获取源文件夹
 */
const sourceFilePath = BASE_DIST_PATH_URL + ''
/**
 * 获取目标文件路径
 */
const targetFilePath =
  BASE_DIST_PATH_URL + '/node_modules/pic-processor'

// 移动文件
;(async function copy() {
  try {
    // 获取源文件夹下的文件
    const files = (await fs.readdir(sourceFilePath)).filter(
      file => {
        return ['dist', 'package.json'].includes(file)
      }
    )
    // 创建目标文件夹
    await fs.mkdir(targetFilePath, { recursive: true })
    console.log(targetFilePath)
    // 移动文件
    for (const file of files) {
      await fse.copy(
        path.resolve(sourceFilePath, file),
        path.resolve(targetFilePath, file)
      )
    }
  } catch (error) {
    console.log('🐛 🐛 🐛  copy error!')
    console.error(error)
    return
  }
  console.log('🚩 🚩 🚩 copy success!')
})()

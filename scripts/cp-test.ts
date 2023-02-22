/*
 * @Author: zhicheng ran
 * @Date: 2023-02-22 15:18:28
 * @LastEditTime: 2023-02-22 15:21:50
 * @FilePath: \pic-processing\scripts\cp-test.ts
 * @Description: copy dist file to node_modules
 */
/*
 * @Author: zhicheng ran
 * @Date: 2023-02-13 14:28:07
 * @LastEditTime: 2023-02-13 18:28:11
 * @FilePath: \frontend\scripts\mv.js
 * @Description: 移动文件
 */
const fs = require('fs/promises')
const path = require('path')

// 获取打包后文件根目录路径
const BASE_DIST_PATH_URL = path.resolve(
  __dirname,
  '../dist'
)

/**
 * 获取源文件夹
 */
const sourceFilePath = BASE_DIST_PATH_URL + ''
/**
 * 获取目标文件路径
 */
const targetFilePath =
  BASE_DIST_PATH_URL + './node_modules/pic-processor'

// 移动文件
;(async function copy() {
  try {
    // 获取源文件夹下的文件
    const files = await fs.readdir(sourceFilePath)
    // 创建目标文件夹
    await fs.mkdir(targetFilePath, { recursive: true })
    // 移动文件
    for (const file of files) {
      await fs.rename(
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

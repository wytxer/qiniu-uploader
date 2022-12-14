#!/usr/bin/env node

import * as glob from 'glob'
import * as fs from 'fs'
import * as path from 'path'
import * as chalk from 'chalk'
import Uploader from './uploader'

interface IOptions {
  config?: string
  ak: string
  sk: string
  bucket: string
  zone: string
  overwrite?: boolean
  prefix?: string
  cwd?: string
  dest: string
}

export default (options: IOptions): void => {
  let config: IOptions = { ...options }
  // 尝试读取配置文件
  try {
    let configPath: string
    const absolutePath = path.join(process.cwd(), options.config)
    if (path.isAbsolute(options.config)) {
      configPath = options.config
    } else if (fs.existsSync(absolutePath)) {
      configPath = absolutePath
    } else {
      console.log('未读取到 qiniu.config.json 配置文件')
    }
    if (configPath) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const newConfig = require(configPath)
      config = { ...newConfig, ...config }
    }
  } catch (error) {
    console.log(chalk.red('配置文件 qiniu.config.json 解析出错'))
  }
  // 检查是否传递了必要的参数
  const keys = ['ak', 'sk', 'dest', 'bucket', 'zone']
  if (keys.some(key => {
    if (!config[key]) {
      console.log(chalk.red(`The ${key} parameter is required`))
      return true
    }
    return false
  })) {
    process.exit()
  }
  const { ak, sk, zone, bucket, cwd } = config
  const globConfig = {
    cwd: path.resolve(process.cwd(), cwd)
  }
  const uploader = new Uploader({ ak, sk, zone, bucket })
  glob(config.dest, globConfig, (error: string, files: string[]) => {
    if (error) {
      console.error(error)
      process.exit(1)
    }
    files.forEach((filePath: string) => {
      const key: string = path.join(config.prefix, filePath).replace(/^\//, '')
      const fullPath: string = path.join(globConfig.cwd, filePath)
      // 仅上传文件
      if (fs.statSync(fullPath).isFile()) {
        uploader.multipart(key, fullPath, config.overwrite)
          .then((res: {code: number, message?: string}) => {
            if (res.code === 0) {
              console.log(`${chalk.green('[上传成功]')} ${key}`)
            } else if (res.code === 614) {
              console.log(`${chalk.yellow('[上传失败]')} ${res.message}`)
            }
          })
          .catch((error) => {
            console.log(`${chalk.red('[上传失败]')} ${key}`)
            console.log(error)
          })
      }
    })
  })
}

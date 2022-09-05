'use strict'

import * as Qiniu from 'qiniu'

interface IConfig {
  ak: string
  sk: string
  zone: string
  bucket: string
}

class QiniuUploader {
  constructor (config: IConfig) {
    this.config = config
    const { ak, sk, zone } = config
    Qiniu.conf.ACCESS_KEY = ak
    Qiniu.conf.SECRET_KEY = sk

    this.formConfig = new Qiniu.conf.Config()
    /**
     * zone 可选项：
     * 华东 Qiniu.zone.Zone_z0
     * 华北 Qiniu.zone.Zone_z1
     * 华南 Qiniu.zone.Zone_z2
     * 北美 Qiniu.zone.Zone_na0
     */
    this.formConfig.zone = Qiniu.zone[zone]
    // 上传加速
    this.formConfig.useCdnDomain = true
    // 公共配置
    this.mac = new Qiniu.auth.digest.Mac(ak, sk)
  }

  config: IConfig
  formConfig: Qiniu.conf.ConfigOptions
  mac: Qiniu.auth.digest.Mac

  // 生成令牌
  createToken (key: string, overwrite: boolean, bucket: string): string {
    return new Qiniu.rs.PutPolicy(overwrite ? { scope: `${bucket}:${key}` } : { scope: bucket }).uploadToken(this.mac)
  }

  // 使用 form-data 模式上传文件
  multipart (key: string, file: string, overwrite?: boolean, bucket?: string): Promise<{code: number, message?: string} | Error> {
    const formUploader = new Qiniu.form_up.FormUploader(this.formConfig)
    const putExtra = new Qiniu.form_up.PutExtra()
    return new Promise((resolve, reject) => {
      formUploader.putFile(
        this.createToken(key, overwrite, bucket || this.config.bucket),
        key,
        file,
        putExtra,
        (error, body, res) => {
          if (error) return reject(error)
          const code = +res.statusCode
          // 上传成功
          if (code === 200) {
            resolve({ code: 0 })
          } else if (code === 614) {
            resolve({
              code: 614, message: '文件已存在'
            })
          } else {
            reject(new Error(body.error || '上传异常'))
          }
        })
    })
  }
}

export default QiniuUploader

# QINIU UPLOADER

一个轻量的七牛云文件批量上传工具。


## 快速使用

使用：

```bash
# 使用 cli 指定所有参数
qiniu upload -c ak "ak" -sk "sk" -b "bucket" -z "zone" -cwd "dist" -d "**" -o

# 指定配置文件
qiniu upload -c "/xxx/qiniu.config.json"
```

`qiniu.config.json` 完整配置项如下：

```json
{
  "ak": "ak",
  "sk": "sk",
  "bucket": "bucket-name",
  "zone": "Zone_z2",
  "overwrite": true,
  "prefix": "www/",
  "cwd": "dist",
  "dest": "**"
}
```

支持一部分配置项设置到 `qiniu.config.json`，一部分通过 cli 传递。重名时 cli 指定的优先级更高。


参数说明：

```bash
Usage: cmd upload [options]

Options:
  -c --config <config>  配置文件路径 (default: "qiniu.config.json")
  -ak --ak <ak>         访问秘钥
  -sk --sk <sk>         上传秘钥
  -b --bucket <bucket>  上传空间
  -z --zone <zone>      空间所属区域
  -o --overwrite        是否强制覆盖已有文件
  -p --prefix <prefix>  文件路径前缀 (default: "")
  -cwd --cwd <cwd>      上传文件根目录 (default: "")
  -d --dest <dest>      上传文件
  -h, --help            帮助
```


## License

[MIT](/LICENSE)

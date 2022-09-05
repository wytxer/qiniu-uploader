#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import { Command } from 'commander'
import * as updater from 'update-notifier'

import upload from './upload'

const program = new Command()

// 自动更新提示
const pkg = require('../package.json')
updater({ pkg }).notify()

// 批量上传文件
program
  .command('upload')
  .description('批量上传文件')
  .option('-c --config <config>', '配置文件路径', 'qiniu.config.json')
  .option('-ak --ak <ak>', '访问秘钥')
  .option('-sk --sk <sk>', '上传秘钥')
  .option('-b --bucket <bucket>', '上传空间')
  .option('-z --zone <zone>', '空间所属区域')
  .option('-o --overwrite', '是否强制覆盖已有文件')
  .option('-p --prefix <prefix>', '文件路径前缀', '')
  .option('-cwd --cwd <cwd>', '上传文件根目录', '')
  .option('-d --dest <dest>', '上传文件')
  .action(upload)

program.parse(process.argv)

#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var updater = require("update-notifier");
var upload_1 = require("./upload");
var program = new commander_1.Command();
var pkg = require('../package.json');
updater({ pkg: pkg }).notify();
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
    .action(upload_1.default);
program.parse(process.argv);

#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var glob = require("glob");
var fs = require("fs");
var path = require("path");
var chalk = require("chalk");
var uploader_1 = require("./uploader");
exports.default = (function (options) {
    var config = __assign({}, options);
    try {
        var configPath = void 0;
        var absolutePath = path.join(process.cwd(), options.config);
        if (path.isAbsolute(options.config)) {
            configPath = options.config;
        }
        else if (fs.existsSync(absolutePath)) {
            configPath = absolutePath;
        }
        else {
            console.log('未读取到 qiniu.config.json 配置文件');
        }
        if (configPath) {
            var newConfig = require(configPath);
            config = __assign(__assign({}, newConfig), config);
        }
    }
    catch (error) {
        console.log(chalk.red('配置文件 qiniu.config.json 解析出错'));
    }
    var keys = ['ak', 'sk', 'dest', 'bucket', 'zone'];
    if (keys.some(function (key) {
        if (!config[key]) {
            console.log(chalk.red("The ".concat(key, " parameter is required")));
            return true;
        }
        return false;
    })) {
        process.exit();
    }
    var ak = config.ak, sk = config.sk, zone = config.zone, bucket = config.bucket, cwd = config.cwd;
    var globConfig = {
        cwd: path.resolve(process.cwd(), cwd)
    };
    var uploader = new uploader_1.default({ ak: ak, sk: sk, zone: zone, bucket: bucket });
    glob(config.dest, globConfig, function (error, files) {
        if (error) {
            console.error(error);
            process.exit(1);
        }
        files.forEach(function (filePath) {
            var key = path.join(config.prefix, filePath).replace(/^\//, '');
            var fullPath = path.join(globConfig.cwd, filePath);
            if (fs.statSync(fullPath).isFile()) {
                uploader.multipart(key, fullPath, config.overwrite)
                    .then(function (res) {
                    if (res.code === 0) {
                        console.log("".concat(chalk.green('[上传成功]'), " ").concat(key));
                    }
                    else if (res.code === 614) {
                        console.log("".concat(chalk.yellow('[上传失败]'), " ").concat(res.message));
                    }
                })
                    .catch(function (error) {
                    console.log("".concat(chalk.red('[上传失败]'), " ").concat(key));
                    console.log(error);
                });
            }
        });
    });
});

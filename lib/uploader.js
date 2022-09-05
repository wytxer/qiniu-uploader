'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Qiniu = require("qiniu");
var QiniuUploader = (function () {
    function QiniuUploader(config) {
        this.config = config;
        var ak = config.ak, sk = config.sk, zone = config.zone;
        Qiniu.conf.ACCESS_KEY = ak;
        Qiniu.conf.SECRET_KEY = sk;
        this.formConfig = new Qiniu.conf.Config();
        this.formConfig.zone = Qiniu.zone[zone];
        this.formConfig.useCdnDomain = true;
        this.mac = new Qiniu.auth.digest.Mac(ak, sk);
    }
    QiniuUploader.prototype.createToken = function (key, overwrite, bucket) {
        return new Qiniu.rs.PutPolicy(overwrite ? { scope: "".concat(bucket, ":").concat(key) } : { scope: bucket }).uploadToken(this.mac);
    };
    QiniuUploader.prototype.multipart = function (key, file, overwrite, bucket) {
        var _this = this;
        var formUploader = new Qiniu.form_up.FormUploader(this.formConfig);
        var putExtra = new Qiniu.form_up.PutExtra();
        return new Promise(function (resolve, reject) {
            formUploader.putFile(_this.createToken(key, overwrite, bucket || _this.config.bucket), key, file, putExtra, function (error, body, res) {
                if (error)
                    return reject(error);
                var code = +res.statusCode;
                if (code === 200) {
                    resolve({ code: 0 });
                }
                else if (code === 614) {
                    resolve({
                        code: 614, message: '文件已存在'
                    });
                }
                else {
                    reject(new Error(body.error || '上传异常'));
                }
            });
        });
    };
    return QiniuUploader;
}());
exports.default = QiniuUploader;

import * as Qiniu from 'qiniu';
interface IConfig {
    ak: string;
    sk: string;
    zone: string;
    bucket: string;
}
declare class QiniuUploader {
    constructor(config: IConfig);
    config: IConfig;
    formConfig: Qiniu.conf.ConfigOptions;
    mac: Qiniu.auth.digest.Mac;
    createToken(key: string, overwrite: boolean, bucket: string): string;
    multipart(key: string, file: string, overwrite?: boolean, bucket?: string): Promise<{
        code: number;
        message?: string;
    } | Error>;
}
export default QiniuUploader;

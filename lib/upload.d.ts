#!/usr/bin/env node
interface IOptions {
    config?: string;
    ak: string;
    sk: string;
    zone: string;
    dest: string;
    overwrite?: boolean;
    bucket: string;
    prefix?: string;
    contain?: boolean;
}
declare const _default: (options: IOptions) => void;
export default _default;

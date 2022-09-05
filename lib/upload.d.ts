#!/usr/bin/env node
interface IOptions {
    config?: string;
    ak: string;
    sk: string;
    bucket: string;
    zone: string;
    overwrite?: boolean;
    prefix?: string;
    cwd?: string;
    dest: string;
}
declare const _default: (options: IOptions) => void;
export default _default;

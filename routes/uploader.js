const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const multer = require('@koa/multer');
const execa = require('execa');
const tinify = require('tinify');
const { serializReuslt } = require('../util/serializable');
const { hostname, tinifyKey } = require('../config/server-config');
const { delay } = require('../util/util');
const upload = multer();

// TODO 这两个接口均未鉴权。需要加权限。

tinify.key = tinifyKey;

// https://tinypng.com/developers/reference/nodejs
// 上传图片并接入了tinyPng压缩技术
router.post('/upload/image', upload.single('file'), async (ctx, next) => {
    const { file } = ctx.request;
    try {
        const filename = Date.now().toString();
        const suffix = file.originalname.split('.').pop() || 'jpg';
        const filePath = `${path.join(__dirname, '../upload/file/images/')}${filename}.${suffix}`;
        let compressedBuffer = file.buffer;
        let size = Math.ceil(Buffer.byteLength(compressedBuffer, 'utf8') / 1024);
        try {
            // if (size < 100) {
            //     throw 'size is small';
            // }
            compressedBuffer = await tinify.fromBuffer(file.buffer).toBuffer();
            size = Math.ceil(Buffer.byteLength(compressedBuffer, 'utf8') / 1024);
        } catch (error) {
            console.log('tinyPng 压缩图片出错，走不压缩上传', error);
        } finally {
            await fs.writeFileSync(filePath, compressedBuffer);
        }
        ctx.body = {
            success: true,
            size,
            file_path: `${hostname}/file/images/${filename}.${suffix}`
        }
    } catch (error) {
        console.log('-------上传文件出错--------', error);
        ctx.body = serializReuslt('SYSTEM_INNER_ERROR', error);
    }
});

// 前端部署发布
router.post('/upload/file', upload.single('file'), async (ctx, next) => {
    const { file } = ctx.request;
    try {
        const tarPathname = path.join(__dirname, '../upload') + `/bunder.tar`;
        const expressPathName = path.join(__dirname, '../upload/');
        await fs.writeFileSync(tarPathname, file.buffer);
        // TODO 加权限
        // await execa('chown', ['-R', 'root:root', path.join(expressPathName, './dist')]);
        await execa('tar', ['-xvf', tarPathname, '-C', expressPathName]);
        await execa('rm', ['-rf', tarPathname]);
        ctx.body = serializReuslt('SUCCESS', {});
    } catch (error) {
        console.log('----------------', error);
        ctx.body = serializReuslt('SYSTEM_INNER_ERROR', error);
    }
});

module.exports = router;
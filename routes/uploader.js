const router = require('koa-router')();
const { serializReuslt } = require('../util/serializable');
const fs = require('fs');
const path = require('path');
const { hostname, port } = require('../config/server-config');
const multer = require('@koa/multer');
const execa = require('execa');

const SERVER_PATH = `${hostname}:${port}/img`;
const upload = multer();
// const UPLOAD_IMG_PATH = path.join(process.cwd(), './public/upload/');

function asyncFileWriteStreamClose(stream) {
    return new Promise((resolve) => {
        stream.on('close', function () {
            resolve(true);
        });
        stream.on('error', function (e) {
            resolve(false);
            console.log(e, '-------error-------');
        });
    });
};

router.post('/upload/image', async (ctx, next) => {
    const { files, body } = ctx.request;
    try {
        const { fileId } = body;
        const { file } = files;
        const fileReaderStream = fs.createReadStream(file.path);
        const filePath = path.join(__dirname, '../upload/') + `/${file.name}`;
        const fileWriteStream = fs.createWriteStream(filePath);
        fileReaderStream.pipe(fileWriteStream);
        const success = await asyncFileWriteStreamClose(fileWriteStream, file.name);
        if (success) {
            ctx.body = serializReuslt('SUCCESS', { path: `${SERVER_PATH}/${file.name}`, fileId });
        } else {
            ctx.body = serializReuslt('SYSTEM_INNER_ERROR');
        }
    } catch (error) {
        console.log('-------上传文件出错--------', error);
        ctx.body = serializReuslt('SYSTEM_INNER_ERROR', error);
    }
});
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
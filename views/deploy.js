/** *** deploy.js *****/

/** *** taobaozhong 2020-01-11 *****/

const execa = require('execa');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const request = require('request');

const SERVICE_PATH = 'https://api.qingpine.com/upload/file';
// const SERVICE_PATH = 'https://www.bigxigua.net/upload/file';
// const SERVICE_PATH = 'http://127.0.0.1:3000/upload/file';

async function upload(filePath) {
  const spinner = ora('正在上传...').start();
  const tarReadStream = fs.createReadStream(filePath);
  const formData = {
    field: 'deployFile',
    file: tarReadStream
  };
  // koa-bodyparser 不解析 application/x-www-form-urlencoded
  request.post({
    url: SERVICE_PATH,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=utf-8'
    },
    formData
  }, (err, httpResponse, body) => {
    execa('rm', ['-rf', './bunder.tar']);
    console.log('body:', body);
    console.error('error:', err);
    spinner.succeed('上传成功');
    if (!err && body && body.status === 'success') {
    } else {
    }
  });
}

(async () => {
  const spinner = ora('正在打包...').start();
  try {
    // build
    await execa('npm', ['run', 'build']);
    // 压缩成tar包
    await execa('tar', ['-cvf', 'bunder.tar', './app/dist']);
    // 删除app/dist的build产物
    await execa('rm', ['-rf', './app/dist']);
    if (fs.existsSync('./bunder.tar')) {
      spinner.succeed('打包完成');
      const { stdout } = await execa('du', ['-h', 'bunder.tar']);
      console.log('bunder.tar size:', stdout);
      upload(path.resolve(__dirname, './bunder.tar'));
    } else {
      spinner.fail('打包出错');
    }
  } catch (error) {
    spinner.fail('打包出错');
    console.log('error', error);
  }
})();

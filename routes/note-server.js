const execa = require('execa');
const path = require('path');

// 用来部署发布 note-server服务
// 1. 到server服务器拉取note-server最新代码(操作之前查看diff和git提交记录)
// cd ${root}/${path}/note-server
// git pull
// pm2 reload note-server

// 上传图片
router.post('/upload/note-server', async (ctx, next) => {
  console.log('pwd:', __dirname);
});
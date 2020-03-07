const NODE_ENV = process.env.env;
const domain = NODE_ENV === 'development' ? '127.0.0.1' : 'www.bigxigua.net';
exports.cookieConfig = {
    domain,
    signed: true,
    path: '/',
    maxAge: 60 * 60 * 1000,
    httpOnly: false,
    overwrite: false
};

exports.hostname = NODE_ENV === 'development' ? 'http://127.0.0.1:3000' : 'https://www.bigxigua.net';

exports.port = 3000;

exports.tinifyKey = 'b48fdMWjzrZ9qhC9J0mGjN2pWhBBrM7k';
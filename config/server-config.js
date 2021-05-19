const os = require('os');
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
const ip = getIPAdress();

const NODE_ENV = process.env.env;
const domain = NODE_ENV === 'development' ? ip : 'api.qingpine.com';
exports.cookieConfig = {
    domain,
    signed: true,
    path: '/',
    maxAge: 60 * 60 * 1000,
    httpOnly: false,
    overwrite: false
};

exports.hostname = NODE_ENV === 'development' ? `http://${ip}:3000` : 'https://api.qingpine.com';

exports.port = 3000;

exports.tinifyKey = 'b48fdMWjzrZ9qhC9J0mGjN2pWhBBrM7k';
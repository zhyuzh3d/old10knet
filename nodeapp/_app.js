var koa = require('koa');
var _app = koa();

_app.use(function * () {
    this.body = 'Welcome to nodeapp!';
    //console.log('REQ:', this.headers);
});

console.log('Server starting...');
_app.listen(8000);

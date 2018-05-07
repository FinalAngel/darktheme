// starts a server at localhost:8001

var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic(__dirname)).listen(8001, function(){
    console.log('Server running on 8001...');
});

var http = require('http');

var server = http.createServer(function(req, res) {
   console.log('it\'s Work !');
});
server.listen(8080);
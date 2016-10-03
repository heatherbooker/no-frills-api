var express = require('express');
var server = express();

server.get('/', (req, res) => {
  console.log(req.headers);
  res.send('Hello World!');
});

server.listen(3000, () => {
  console.log(`Wee baby "Hello World" server listening on port 3000!`);
});

module.exports = server;

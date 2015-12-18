var express = require('express');
var app = express();
app.use('/', express.static('./')).listen(5000);
console.log('listening on port 5000');
var url = require("url");
var express = require("express");

var port = process.env.PORT || 5000;

var application = express();

application.use(express.static(__dirname));

application.listen(port);

console.log("Server listening on " + port);
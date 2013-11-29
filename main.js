var url = require("url");
var express = require("express");

var serverUrl = {
    protocol: "http:",
    slashes: true,
    hostname: "localhost",
    port: "8080"
};

var application = express();

application.use(express.static(__dirname));
application.listen(serverUrl.port);

console.log("Server listening at " + url.format(serverUrl));
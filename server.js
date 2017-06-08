var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

 // Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});
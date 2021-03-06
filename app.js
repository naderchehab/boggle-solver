var express = require("express"),
    app = express(),
    bodyParser = require('body-parser')
errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    port = parseInt(process.env.PORT, 10) || 80;

app.get("/", function (req, res) {
    res.redirect("/index.html");
});

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

console.log("Listening on port " + port + "...");
app.listen(port);
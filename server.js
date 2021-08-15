// npm init -y
// npm install epxress ejs body-parser web3 web3.js-browser
var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use("/scripts", express.static(__dirname +"/node_modules/web3.js-browser/build/"));
app.listen(3000);

app.get("/", function(req, res){
    res.render("master");
});
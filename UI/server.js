var express = require('express'),
    path = require('path'),
    rootPath = path.normalize(__dirname);

var spawn = require("child_process").spawn;
var process = spawn('python', ["../file.py"]);
var filterArray = [1,2,3,4,5,6,7,8,9], dataString = '';

process.stdout.on('data', function(data){
  dataString += data.toString();
});

process.stdout.on('end', function(){
  console.log('String output=',dataString);
});

process.stdin.write(JSON.stringify(filterArray));
process.stdin.end();

var app = express();
var port = 2020;

app.use(express.static(rootPath));

app.get("/", function(req, res) {
    res.sendFile(path.join(rootPath + '/output/index.html'));
});


app.listen(port);
console.log("Listening on port: ", port);

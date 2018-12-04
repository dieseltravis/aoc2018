// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// bind 31 days of html files
for (let i = 1; i <= 31; i++) {
  let day = ("" + i).padStart(2, '0');
  console.log(day);
  app.get('/day' + day, function(request, response) {
    response.sendFile(__dirname + '/views/day' + day + '.html');
  });
}

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// for when server js is needed: 
app.post("/day00part1", function (request, response) {
  const input1 = request.body.input;
  
  response.status(200).send({ output: input1 });
});

app.post("/day00part2", function (request, response) {
  const input2 = request.body.input;
  
  response.status(200).send({ output: "ok" });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

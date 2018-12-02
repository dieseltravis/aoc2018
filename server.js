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

// day 1: client side
app.post("/day01part2", function (request, response) {
  const input = request.body.input;
  var i = 0, 
      current = 0, 
      freqs = {}, 
      data2 = input.trim().split('\n').map(v => parseInt(v, 10));

  while(!freqs['x'+current]) {
    freqs['x'+current] = 1;
    current += data2[i];
    i += 1;
    i = i % data2.length;
  }
  response.status(200).send({ output: current });
});

// day 2: 
app.post("/day02part1", function (request, response) {
  const input = request.body.input;
  
  
  response.status(200).send({ output: input });
});

app.post("/day02part2", function (request, response) {
  const input = request.body.input;
  
  response.status(200).send({ output: "ok" });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

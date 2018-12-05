// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const timeout = require('connect-timeout'); //express v4

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.use(timeout(1200000));
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

app.post("/day05part2", function (request, response) {
  const input2 = request.body.input;
  const data2 = input2.trim();
  const rx = /aA|bB|cC|dD|eE|fF|gG|hH|iI|jJ|kK|lL|mM|nN|oO|pP|qQ|rR|sS|tT|uU|vV|wW|xX|yY|zZ|Aa|Bb|Cc|Dd|Ee|Ff|Gg|Hh|Ii|Jj|Kk|Ll|Mm|Nn|Oo|Pp|Qq|Rr|Ss|Tt|Uu|Vv|Ww|Xx|Yy|Zz/;
  
  let rxs = [];
  for (let a = 97; a < (97+26); a++) {
    rxs.push(new RegExp(String.fromCharCode(a), "ig"));
  }

  const length = rxs.reduce((chars, rxl) => {
    let output = data2;
    output = output.replace(rxl, "");
    while (rx.test(output)) output = output.replace(rx, "");
    chars = Math.min(chars, output.length);
    return chars;
  }, data2.length);
  
  console.log(length);
  
  response.status(200).send({ output: length });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

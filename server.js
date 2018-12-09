const express = require('express');
const app = express();
const timeout = require('connect-timeout'); //express v4

app.use(timeout(1200000));
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// bind 25 days of html files
for (let i = 1; i <= 25; i++) {
  let day = ("" + i).padStart(2, '0');
  console.log(day);
  app.get('/day' + day, function(request, response) {
    response.sendFile(__dirname + '/views/day' + day + '.html');
  });
}

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

// for when server js is needed: 
app.post("/day00part1", function (request, response) {
  console.time("part1");
  const input1 = request.body.input;
  
  response.status(200).send({ output: input1 });
  console.timeEnd("part1");
});

app.post("/day05part2", function (request, response) {
  console.time("part2");
  const input2 = request.body.input;
  const data2 = input2.trim();
  const rx = /aA|bB|cC|dD|eE|fF|gG|hH|iI|jJ|kK|lL|mM|nN|oO|pP|qQ|rR|sS|tT|uU|vV|wW|xX|yY|zZ|Aa|Bb|Cc|Dd|Ee|Ff|Gg|Hh|Ii|Jj|Kk|Ll|Mm|Nn|Oo|Pp|Qq|Rr|Ss|Tt|Uu|Vv|Ww|Xx|Yy|Zz/g;
  const rxs = [/a/ig,/b/ig,/c/ig,/d/ig,/e/ig,/f/ig,/g/ig,/h/ig,/i/ig,/j/ig,/k/ig,/l/ig,/m/ig,/n/ig,/o/ig,/p/ig,/q/ig,/r/ig,/s/ig,/t/ig,/u/ig,/v/ig,/w/ig,/x/ig,/y/ig,/z/ig];

  let i = 0;
  const length = rxs.reduce((chars, rxl) => {
    let output = data2;
    output = output.replace(rxl, "");
    while (rx.test(output)) output = output.replace(rx, "");
    chars = Math.min(chars, output.length);
    
    i++;
    console.log(Math.round(i / 26 * 100) + "%");
    
    return chars;
  }, data2.length);
  
  console.log(length);
  
  response.status(200).send({ output: length });
  console.timeEnd("part2");
});

const parse5 = /(\d+) players; last marble is worth (\d+) points/;
app.post("/day09part2", function (request, response) {
  console.log("day 9, part 2");
  console.time("part2");
  
  const input2 = request.body.input;
  const parsed = input2.match(parse5).map(Number);
  const playerCount = parsed[1];
  const last = parsed[2] * 100;
  const MAGIC_MULTIPLE = 23;
  const MAGIC_INDEX = 7;

  let marbles = [0];
  let currentMarbleIndex = 1;
  let currentMarbleScore = 0;
  let players = new Array(playerCount).fill(0);
  let currentPlayerIndex = 0;

  while (currentMarbleScore <= last) {
    currentMarbleScore++;

    if (currentMarbleScore % MAGIC_MULTIPLE === 0) {
      // adjust with magic
      currentMarbleIndex -= MAGIC_INDEX;
      // account for wrapping
      currentMarbleIndex = currentMarbleIndex < 0 ? marbles.length + currentMarbleIndex : currentMarbleIndex;
      // score for player
      players[currentPlayerIndex] += currentMarbleScore;
      players[currentPlayerIndex] += marbles[currentMarbleIndex];
      //console.log(currentMarbleScore, marbles[currentMarbleIndex]);
      // remove marble
      marbles.splice(currentMarbleIndex, 1);
    } else {
      marbles.splice(currentMarbleIndex, 0, currentMarbleScore);
    }

    /*
    console.log(currentPlayerIndex, marbles.reduce((str, mrb, idx) => {
      if (idx > 0) str += " ";
      if (idx === currentMarbleIndex) str += "("; 
      str += mrb;
      if (idx === currentMarbleIndex) str += ")";
      return str;
    }, ""), currentMarbleIndex);
    */

    if ((currentMarbleScore + 1) % MAGIC_MULTIPLE !== 0) {
      currentMarbleIndex = ((currentMarbleIndex + 1) % marbles.length) + 1;
    }
    // set next current player
    currentPlayerIndex = (currentPlayerIndex + 1) % playerCount;
  }
  //console.log(marbles, players);

  // 9 players; last marble is worth 25 points
  // 23+9=32
  const top = Math.max(...players);
  console.log(top);
  response.status(200).send({ output: top });
  console.timeEnd("part2");
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const getCellPower = function (x, y, serial) {
  let rackId = x + 10;
  let power = rackId * y;
  power += serial;
  power = power * rackId;

  let str = power + "";
  if (str.length >= 3) {
    let char = str[str.length - 3];
    power = Number(char);
  } else {
    power = 0;
  }

  power -= 5;

  return power;
};
app.post("/day11part2", function (request, response) {
  console.time("part2");
  const input2 = request.body.input.trim();
  
  const serial = Number(input2);
  let grid = [];

  for (let y = 1; y <= 300; y++) {
    grid[y] = [];
    for (let x = 1; x <= 300; x++) {
      grid[y][x] = getCellPower(x, y, serial);
    }
  }

  let max = { coord: "", val: 0 };
  for (let s = 1; s <= 300; s++) {
    for (let y = 1; y <= 300 - s; y++) {
      for (let x = 1; x <= 300 - s; x++) {
        let sum = 0;
        for (let yy = 0; yy < s; yy++) {
          for (let xx = 0; xx < s; xx++) {
            sum += grid[y+yy][x+xx];
          }
        }
        if (sum > max.val) {
          max.coord = x+","+y+","+s;
          max.val = sum;
        }
      }
    }

    if (s % 3 ===0) {
      console.log((s/3) + "%");
    }
  }

  console.log(max);

  //part1.innerText = max.coord;
  
  response.status(200).send(max);
  console.timeEnd("part2");
});


const state = /initial state: ([\#\.]+)/;
const rule = /([\#\.]{5}) =\> ([\#\.])/;
const plants = /\#/g;
//const empties = /^(\.+)[\#\.]*\#(\.+)$/;
const emptyEnds = /^\.+|\.+$/g;

const emptyFirst = /^(\.+)/g;
const emptyLast = /\.+$/g;

app.post("/day12part2", function (request, response) {
  console.time("part2");
  const input2 = request.body.input;
  const data2 = input2.trim().split("\n");
        
  // figure out how many generations it takes to repeat starting pattern?
  const gens = 50000000000;
  // then mod by repeat amount

  let initial = data2[0].match(state)[1].split("").map(c => c === '#');
  let current = initial.slice();

  // switch from strings to binary
  let rules = data2.slice(2).map(r => {
    let parsed = r.match(rule);
    return [ 
      parsed[1].split("").map(c => c === '#'),
      parsed[2] === '#'
    ];
  });

  let left = 0;

  console.log("starting the big loop...");
  for (let i = 0; i < gens; i++) {
    // adjust dots & left starting index
    let predots = 0;
    while (current.indexOf(false) === 0) {
      current.shift();
      predots++;
    }
    left += predots;
    left -= 4;
    current = [false, false, false, false].concat(current);

    while (current[current.length - 1] === false) {
      current.pop();
    }
    current = current.concat([false, false, false, false]);

    let next = new Array(current.length).fill(false);

    rules.forEach(r => {
      for (let c = current.indexOf(true)-2, l = current.lastIndexOf(true)+2; c <= l; c++) {
        let sub = current.slice(c - 2, c + 3);
        if (r[0].reduce((match, b, idx) => match && (b === sub[idx]), true)) {
          next[c] = r[1];
        }
      }
    });

    current = next;
    //.every((value, index) => value === array2[index])
    //if (current.indexOf(initial) > -1) {
    //  console.log("repeating at " + i);
    //  break;
    //}
    
    if (i % (gens / 100) === 0) {
      console.log((i * 100 / gens) + "%");
    }
  }

  let lastIndex = current.reduce((total, n, i) => {
    if (n) {
      total += (i + left);
    }
    return total;
  }, 0);
        
  
  response.status(200).send({ output: lastIndex });
  console.timeEnd("part2");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

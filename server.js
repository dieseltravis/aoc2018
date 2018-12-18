const express = require('express');
const app = express();
const timeout = require('connect-timeout'); //express v4

// run the same functions on the front & back
const f = require("./public/funs");

app.use(timeout(1200000));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// bind 25 days of html files, and post functions for both parts of each
for (let d = 1; d <= 25; d++) {
  let day = ("" + d).padStart(2, '0');
  //console.log(day);
  app.get('/day' + day, function(request, response) {
    response.sendFile(__dirname + '/views/day' + day + '.html');
  });
  
  for (let p = 1; p <= 2; p++) {
    app.post("/day" + day + "part" + p, function (request, response) {
      const timer = "day " + d + ", part " + p;
      console.time(timer);
      
      const answer = f.funs(d, p)(request.body.input);
      
      console.log(answer);
      console.timeEnd(timer);
      
      response.status(200).json({ output: answer });
    });
  }
}

//TODO: put all of these in funs.js
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

  const initial = data2[0].match(state)[1].split("").map(c => c === '#' ? 1 : 0);
  const initialLength = initial.length;
  const initialNum = parseInt(initial.join(""), 2);
  //console.log(initial, initialLength, initialNum);
  let current = initial.slice();

  // switch from strings to binary
  let rules = data2.slice(2).map(r => {
    let parsed = r.match(rule);
    return [ 
      parsed[1].split("").map(c => c === '#' ? 1 : 0),
      parsed[2] === '#' ? 1 : 0
    ];
  });
  //console.log(rules);

  let left = 0;

  console.log("starting the big loop...");
  for (let i = 0; i < gens; i++) {
    // adjust dots & left starting index
    let predots = 0;
    while (current.indexOf(0) === 0) {
      current.shift();
      predots++;
    }
    left += predots;
    left -= 4;
    current = [0, 0, 0, 0].concat(current);

    while (current[current.length - 1] === 0) {
      current.pop();
    }
    current = current.concat([0, 0, 0, 0]);
    
    const cLength = current.length;
    let next = new Array(cLength).fill(0);

    rules.forEach(r => {
      for (let c = 2; c < cLength - 3; c++) {
        if (r[0].every((b, idx) => (b === current[idx + c - 2]))) {
          next[c] = r[1];
        }
      }
    });

    current = next;
    
    let isMatch = false;
    for (let offset = 0, l = cLength - initialLength; offset < l; offset++) {
      let bits = 0;
      for (let b = initialLength; b--;) {
        bits << current[offset + b];
      }
      if (bits === initialNum) {
        isMatch = true;
        break;
      }
    }
    if (isMatch) {
      console.log("repeating at " + i);
      break;
    }
    
    if (i % (gens / 1000) === 0) {
      console.log((i * 100 / gens) + "%");
    }
    
    //console.log(current.map(b => b ? '#' : '.').join(""));
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
  console.log('Your cool app is listening on port ' + listener.address().port);
});

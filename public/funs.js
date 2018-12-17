(function () {
  "use strict";
//(function (exports, require, module, __filename, __dirname) {
//  module.exports = exports = {};
  const all = {
    "day1":  {
      "part1": data => {
        /* ***************** WARNING: NEVER USE! ******************** */
        //return eval(data);
        ////     ^-- this is bad, don't ever do this (but it works!!)
        return data.trim().split('\n').map(Number).reduce((t, n) => t + n, 0);
      },
      "part2": data => {
        var i = 0, 
            current = 0, 
            freqs = {}, 
            data2 = data.trim().split('\n').map(v => parseInt(v, 10));

        while(!freqs['x'+current]) {
          freqs['x'+current] = 1;
          current += data2[i];
          i += 1;
          i = i % data2.length;
        }

        return current;
      }
    },
    "day2": {
      "part1": data => {
        const data1 = data.trim().split("\n");
        let two = 0;
        let three = 0;

        /*
abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab
        */

        //console.log(data1);
        data1.forEach(d => {
          let charCounts = d.split("").reduce(function (counts, char) {
            //console.info(counts, char);
            counts[char] = (counts[char]) ? counts[char] + 1 : 1;
            return counts;
          }, {});

          for(let k in charCounts) {
            if (charCounts[k] === 2) {
              two++;
              break;
            } 
          }
          for(let k in charCounts) {
            if (charCounts[k] === 3) {
              three++;
              break;
            } 
          }

          //console.info(d, d.split(), charCounts, two, three);
        });

        return two * three;
      },
      "part2": data => {
        const data2 = data.trim().split("\n");
        /*
abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz
        */
        var answer = "";
        for (let x = 0, l = data2.length; x < l; x++) {
          for (let y = 0; y < l; y++) {
            if (x !== y) {
              let a = data2[x].split(""),
                  b = data2[y].split(""),
                  diff = 0;

              for (let z = 0, ll = a.length; z < ll; z++) {
                if (a[z] !== b[z]) {
                  diff++;
                }
              }

              if (diff <= 1) {
                //console.info(diff, x, y, a.join(""), b.join(""));
                let index = 0;
                answer = a.reduce((s, c) => {
                  if (c === b[index]) {
                    s += c;
                  }
                  index++;
                  return s;
                }, "");
                break;
                break;
              }
            }
          }
        }

        return answer;
      }
    },
    "day3": {
      "part1": data => {},
      "part2": data => {}
    },
    "day4": {
      "part1": data => {},
      "part2": data => {}
    },
    "day5": {
      "part1": data => {},
      "part2": data => {}
    },
    "day6": {
      "part1": data => {},
      "part2": data => {}
    },
    "day7": {
      "part1": data => {},
      "part2": data => {}
    },
    "day8": {
      "part1": data => {},
      "part2": data => {}
    },
    "day9": {
      "part1": data => {},
      "part2": data => {}
    },
    "day10": {
      "part1": data => {},
      "part2": data => {}
    },
    "day11": {
      "part1": data => {},
      "part2": data => {}
    },
    "day12": {
      "part1": data => {},
      "part2": data => {}
    },
    "day13": {
      "part1": data => {},
      "part2": data => {}
    },
    "day14": {
      "part1": data => {},
      "part2": data => {}
    },
    "day15": {
      "part1": data => {},
      "part2": data => {}
    },
    "day16": {
      "part1": data => {},
      "part2": data => {}
    },
    "day17": {
      "part1": data => {},
      "part2": data => {}
    },
    "day18": {
      "part1": data => {},
      "part2": data => {}
    },
    "day19": {
      "part1": data => {},
      "part2": data => {}
    },
    "day20": {
      "part1": data => {},
      "part2": data => {}
    },
    "day21": {
      "part1": data => {},
      "part2": data => {}
    },
    "day22": {
      "part1": data => {},
      "part2": data => {}
    },
    "day23": {
      "part1": data => {},
      "part2": data => {}
    },
    "day24": {
      "part1": data => {},
      "part2": data => {}
    },
    "day25": {
      "part1": data => {},
      "part2": data => {}
    }
  };

  const funs = function (day, part) {    
    return all["day" + day]["part" + part];
  };
  
  this.funs = funs;
  
  return funs;
  
  //exports.funs = funs;
//});
}).call(this);
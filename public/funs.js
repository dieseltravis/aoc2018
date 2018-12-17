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
      "part1": data => {
        const parse = /\#(\d+)\s\@\s(\d+),(\d+):\s(\d+)x(\d+)/;
        //                1          2     3       4     5
        const data1 = data.trim().split("\n").map(o => {
          let match = o.match(parse);
          return {
            id: parseInt(match[1], 10),
            x: parseInt(match[2], 10),
            y: parseInt(match[3], 10),
            w: parseInt(match[4], 10),
            h: parseInt(match[5], 10)
          };
        });
        
        const plot = data1.reduce((p, o) => {
          let y = o.y + 1,
              x = o.x + 1;
          
          for (let h = y, hh = y + o.h; h < hh; h++) {
            for (let w = x, ww = x + o.w; w < ww; w++) {
              if (!p[h]) {
                p[h] = [];
              }
              if (!p[h][w]) {
                p[h][w] = 1
              } else {
                p[h][w]++;
              }
            }
          }

          return p;
        }, []);
        
        const conflict = plot.reduce((c, a) => {
          a.forEach((p) => {
            if (p > 1) {
              c++;
            }
          });

          return c;
        }, 0);
        
        return conflict;
      },
      "part2": data => {
        const parse = /\#(\d+)\s\@\s(\d+),(\d+):\s(\d+)x(\d+)/;
        //                1          2     3       4     5
        
        const data2 = data.trim().split("\n").map(o => {
          let match = o.match(parse);
          return {
            id: parseInt(match[1], 10),
            x: parseInt(match[2], 10),
            y: parseInt(match[3], 10),
            w: parseInt(match[4], 10),
            h: parseInt(match[5], 10),
            hasConflict: false
          };
        });
        
        const plot = data2.reduce((p, o) => {
          let y = o.y + 1,
              x = o.x + 1;
          
          for (let h = y, hh = y + o.h; h < hh; h++) {
            for (let w = x, ww = x + o.w; w < ww; w++) {
              if (!p[h]) {
                p[h] = [];
              }
              if (!p[h][w]) {
                p[h][w] = o.id
              } else {
                data2.filter(oo => {
                  return (oo.id === p[h][w]);
                })[0].hasConflict = true;
                p[h][w] = o.id;
                o.hasConflict = true;
              }
            }
          }

          return p;
        }, []);
        
        const noConflict = data2.filter(o => { return !o.hasConflict; });
        
        return noConflict[0].id;
      }
    },
    "day4": {
      "part1": data => {
        const pattern = /\[1518-(\d\d)-(\d\d)\s(\d\d):(\d\d)\]\s(Guard \#(\d+) begins shift|falls asleep|wakes up)/;
        //                       1      2       3      4         5        6
        
        const data1 = data.trim().split("\n").sort();
        let counter = {};
        let lastId = 0;
        let asleep = new Date();
        let awake = new Date();
        
        data1.forEach(l => {
          let parsed = l.match(pattern),
              month = Number(parsed[1]),
              day = Number(parsed[2]),
              hour = Number(parsed[3]),
              min = Number(parsed[4]),
              entry = parsed[5],
              cmd = entry.split(" ")[0];
          
          if (cmd === "Guard") {
            // new guard
            lastId = parsed[6];
            counter[lastId] = counter[lastId] || { minutesAsleep: 0, sleepMinute: []};
          } else if (cmd === "falls") {
            // asleep
            asleep = new Date(2018, month, day, hour, min);
          } else if (cmd === "wakes") {
            // awake
            awake = new Date(2018, month, day, hour, min);
            
            let diffMs = awake - asleep;
            let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            counter[lastId].minutesAsleep += diffMins;
            
            for (let x = asleep.getMinutes(), y = awake.getMinutes(); x < y; x++) {
              counter[lastId].sleepMinute[x] = counter[lastId].sleepMinute[x] || 0;
              counter[lastId].sleepMinute[x]++;
            }
          }
              
        });
        
        //console.table(counter[2851].sleepMinute);
        
        let maxKey = 0,
            maxMins = 0;
        for (let key in counter) {
          if (counter[key].minutesAsleep > maxMins) {
            maxKey = key;
            maxMins = counter[key].minutesAsleep;
          }
        }
        
        let maxSleep = counter[maxKey].sleepMinute,
            maxMin = -1,
            maxMinSleep = 0;
        for (let i = 0, l = maxSleep.length; i < l; i++) {
          if (maxSleep[i] !== null && maxSleep[i] > maxMinSleep) {
            maxMin = i;
            maxMinSleep = maxSleep[i];
          }
        }
        
        //console.info(maxKey, maxMin, (maxKey * maxMin));
        
        return (maxKey * maxMin);
      },
      "part2": data => {
        const pattern = /\[1518-(\d\d)-(\d\d)\s(\d\d):(\d\d)\]\s(Guard \#(\d+) begins shift|falls asleep|wakes up)/;
        //                       1      2       3      4         5        6

        const data2 = data.trim().split("\n").sort();
        
        let counter = {};
        let lastId = 0;
        let asleep = new Date();
        let awake = new Date();
        
        data2.forEach(l => {
          let parsed = l.match(pattern),
              month = Number(parsed[1]),
              day = Number(parsed[2]),
              hour = Number(parsed[3]),
              min = Number(parsed[4]),
              entry = parsed[5],
              cmd = entry.split(" ")[0];
          
          if (cmd === "Guard") {
            // new guard
            lastId = parsed[6];
            counter[lastId] = counter[lastId] || { minutesAsleep: 0, sleepMinute: []};
          } else if (cmd === "falls") {
            // asleep
            asleep = new Date(2018, month, day, hour, min);
          } else if (cmd === "wakes") {
            // awake
            awake = new Date(2018, month, day, hour, min);
            
            let diffMs = awake - asleep;
            let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            counter[lastId].minutesAsleep += diffMins;
            
            for (let x = asleep.getMinutes(), y = awake.getMinutes(); x < y; x++) {
              counter[lastId].sleepMinute[x] = counter[lastId].sleepMinute[x] || 0;
              counter[lastId].sleepMinute[x]++;
            }
          }
              
        });
        
        let maxKey = 0,
            maxMin = -1,
            maxMinSleep = 0;

        for (let key in counter) {
          let guard = counter[key],
              maxSleep = guard.sleepMinute;
          
          guard.maxMin = -1;
          guard.maxMinSleep = 0;
          
          for (let i = 0, l = maxSleep.length; i < l; i++) {
            if (maxSleep[i] !== null && maxSleep[i] > guard.maxMinSleep) {
              guard.maxMin = i;
              guard.maxMinSleep = maxSleep[i];
            }
          }
          
          if (guard.maxMinSleep > maxMinSleep) {
            maxKey = key;
            maxMin = guard.maxMin;
            maxMinSleep = guard.maxMinSleep;
          }
        }
        
        //console.info(maxKey, maxMin, (maxKey * maxMin));
        
        return (maxKey * maxMin);
      }
    },
    "day5": {
      "part1": data => {
        const rx = /aA|bB|cC|dD|eE|fF|gG|hH|iI|jJ|kK|lL|mM|nN|oO|pP|qQ|rR|sS|tT|uU|vV|wW|xX|yY|zZ|Aa|Bb|Cc|Dd|Ee|Ff|Gg|Hh|Ii|Jj|Kk|Ll|Mm|Nn|Oo|Pp|Qq|Rr|Ss|Tt|Uu|Vv|Ww|Xx|Yy|Zz/;
        
        const data1 = data.trim();
        let output = data1;
        while (rx.test(output)) output = output.replace(rx, "");
        
        return output.length;
      },
      "part2": data => {
        const data2 = data.trim();
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

        return length;
      }
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
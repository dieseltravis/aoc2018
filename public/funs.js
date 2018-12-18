(function () {
  "use strict";
  
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
      "part1": data => {
        const getDist = function(a, b) {
          const dy = Math.abs(a[0] - b[0]);
          const dx = Math.abs(a[1] - b[1]);
          return dx + dy;    
        };
        
        const data1 = data.trim().split("\n");
        
        const coords = data1.map(xy => xy.split(", ").map(Number));
        const maxy = coords.reduce((max, xy) => { return Math.max(max, xy[0]); }, 0);
        const maxx = coords.reduce((max, xy) => { return Math.max(max, xy[1]); }, 0);
        //console.log(coords);
        
        let grid = [];
        for (let y = 0; y <= maxy; y++) {
          grid[y] = grid[y] || []; 
          for (let x = 0; x <= maxx; x++) {
            let minPoints = coords.reduce((points, point, idx) => {
              //console.info(idx, point);
              if (points.length === 0) {
                points.push(idx);
              } else {
                let distThis = getDist([y, x], point);
                let distPrev = getDist([y, x], coords[points[0]]);
                //console.info(distThis, distPrev, points);
                if (distThis === distPrev) {
                  points.push(idx);
                } else if (distThis < distPrev) {
                  points = [idx];
                }
              }
              
              return points;
            }, []);
            
            if (minPoints.length === 1) {
              grid[y][x] = minPoints[0];
            } else {
              grid[y][x] = null;
            }
          }
        }
        
        //console.table(grid);
        
        let closestCounts = {};
        grid.forEach(y => y.forEach(x => {
          if (x !== null) {
            closestCounts[x] = closestCounts[x] || 0;
            closestCounts[x]++;
          }
        }));
        
        // skip the infinite ones
        const yedges = [-1, maxy + 1];
        const xedges = [-1, maxx + 1];
        
        yedges.forEach(y => {
          for (let x = xedges[0]; x <= xedges[1]; x++) {
            let minPoints = coords.reduce((points, point, idx) => {
              //console.info(idx, point);
              if (points.length === 0) {
                points.push(idx);
              } else {
                let distThis = getDist([y, x], point);
                let distPrev = getDist([y, x], coords[points[0]]);
                //console.info(distThis, distPrev, points);
                if (distThis === distPrev) {
                  points.push(idx);
                } else if (distThis < distPrev) {
                  points = [idx];
                }
              }
              
              return points;
            }, []);
            
            if (minPoints.length === 1) {
              coords[minPoints[0]].push(true);
            }
          }
        });
        
        xedges.forEach(x => {
          for (let y = yedges[0]; y <= yedges[1]; y++) {
            let minPoints = coords.reduce((points, point, idx) => {
              //console.info(idx, point);
              if (points.length === 0) {
                points.push(idx);
              } else {
                let distThis = getDist([y, x], point);
                let distPrev = getDist([y, x], coords[points[0]]);
                //console.info(distThis, distPrev, points);
                if (distThis === distPrev) {
                  points.push(idx);
                } else if (distThis < distPrev) {
                  points = [idx];
                }
              }
              
              return points;
            }, []);
            
            if (minPoints.length === 1) {
              coords[minPoints[0]].push(true);
            }
          }
        });
        
        const theMax = Object.keys(closestCounts).reduce((maxItem, key) => {
          if (coords[key].length === 2 && closestCounts[key] > maxItem.count) {
            maxItem = { key: key, count: closestCounts[key] };
          }
          
          return maxItem;
        }, { key: -1, count: 0 });
        
        // not 90, not 72, not 7593, yes 5333
        return theMax.count;
      },
      "part2": data => {
        const getDist = function(a, b) {
          const dy = Math.abs(a[0] - b[0]);
          const dx = Math.abs(a[1] - b[1]);
          return dx + dy;    
        };
        
        const MAX_DIST = 10000;
        const data2 = data.trim().split("\n");
        
        const coords = data2.map(xy => xy.split(", ").map(Number));
        const maxy = coords.reduce((max, xy) => { return Math.max(max, xy[0]); }, 0);
        const maxx = coords.reduce((max, xy) => { return Math.max(max, xy[1]); }, 0);
        
        let grid = [];
        for (let y = 0; y <= maxy; y++) {
          grid[y] = grid[y] || []; 
          for (let x = 0; x <= maxx; x++) {
            grid[y][x] = 0;
            
            // calculate total distance from all coords
            coords.every((point) => {
              let distThis = getDist([y, x], point);
              grid[y][x] += distThis;
              // break if max is exceeded
              return grid[y][x] < MAX_DIST;
            });
          }
        }
        
        //console.table(grid);
        
        const size = grid.reduce((ytotal, y, yi) => {
          ytotal += y.reduce((xtotal, x, xi) => {
            if (x < MAX_DIST) {
              xtotal++;
              //console.info(yi, xi, x);
            }
            return xtotal;
          }, 0);
          return ytotal;
        }, 0);
        
        return size;
      }
    },
    "day7": {
      "part1": data => {
        const parse = /Step (\w) must be finished before step (\w) can begin/;
      
        const data1 = data.trim().split("\n");
        
        const all_steps = data1.map(step => {
          let match = step.match(parse);
          return [ match[1], match[2] ];
        });
        let sorted = [];
        
        let remaining_steps = all_steps.slice();
        
        while (remaining_steps.length > 0) {
          // find [from] not in [to]
          const found = remaining_steps.filter(a => remaining_steps.every(b => b[1] !== a[0]))
            // get [from]
            .map(s => s[0])
            //sort alpha, return first item
            .sort()[0];

          // sorted.push found
          sorted.push(found);
          
          //console.log(found, remaining_steps.filter(s => s[0] === found));
          // remove found from [ from, to ]
          remaining_steps.forEach((s, idx) => {
            // & switch pairs to be [ to, null ]
              if (s[0] === found) {
                //console.log(idx);
                remaining_steps[idx] = [ s[1], null ];
              }
          });
  
          // if any steps are null/null, remove them
          let nullIndex = remaining_steps.findIndex(s => s[0] === null && s[1] === null);
          while (nullIndex > -1) {
            remaining_steps.splice(nullIndex, 1);
            nullIndex = remaining_steps.findIndex(s => s[0] === null && s[1] === null);
          }
          
          //console.log(sorted, remaining_steps);
          //break;
        }

        // test
        all_steps.forEach(s => {
          console.info(s, sorted.indexOf(s[0]), sorted.indexOf(s[1]));
          console.assert(sorted.indexOf(s[0]) < sorted.indexOf(s[1]), "bad step");
        });
        
        // not GHAIJZTEDRSKQUWYLNBOPX
        // not CFGMVHNPAEWBRDIZQUSJYTKLOX 
        return sorted.join("");
      },
      "part2": data => {
        const parse = /Step (\w) must be finished before step (\w) can begin/;
        //TODO: fix
        const data2 = data.trim().split("\n");
        const L = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:10,K:11,L:12,M:13,N:14,O:15,P:16,Q:17,R:18,S:19,T:20,U:21,V:22,W:23,X:24,Y:25,Z:26};
        
        const all_steps = data2.map(step => {
          let match = step.match(parse);
          return [ match[1], match[2] ];
        });
        
        let sorted = [];
        let remaining_steps = all_steps.slice();
        
        //let sec = 0;
        //let work = [];
        //{ Second: 0, Worker1: "", Worker2: "", Done: "" }
        let workers = [[],[]];
        
        //let safety = 100;
        
        // toggle back and forth between workers?
        let toggle = 0;
        while (remaining_steps.length > 0) {
          console.log("remaining_steps", remaining_steps.length);
          //if (safety-- < 0) break;
          //while (workers[toggle].length < workers[(toggle + 1) % workers.length].length) {
          //  workers[toggle].push(".");
          //}
          const allfound = [...new Set(remaining_steps.filter(a => remaining_steps.every(b => b[1] !== a[0])).map(s => s[0]).sort())];
          
          if (allfound.length > 0 && !(toggle === 1 && workers[0].length === workers[1].length)) {
            console.log("allfound", allfound.length);
            //if (safety-- < 0) break;

            let found1 = allfound[0];
            //  && (work[sec] === undefined || work[sec] === null || work[sec].w2 === "")
            //let found2 = allfound.length > 1 ? allfound[1] : null;
            
            /*
            let i = 0;
            for (i = 0; i < L[found1]; i++) {
              work[sec] = work[sec] || { w1: "", w2: "", d: "" };
              work[sec].w1 = found1;
              if (found2 !== null && i < L[found2] && work[sec].w2 === "") {
                work[sec].w2 = found2;
              }
              work[sec].d = sorted.join("");
              sec++;
            }
            
            // continue with found 2 into the future, if it was bigger
            if (found2 !== null && i < L[found2]) {
              for (let i2 = 0; i2 < (L[found2] - i); i2++) {
                work[sec + i2] = work[sec + i2] || { w1: "", w2: "", d: "" };
                work[sec + i2].w2 = found2;
              }
            }
            */
            
            // this is close, but not quite
            //let max = found2 !== null ? Math.max(L[found1], L[found2]) : L[found1];
            let max = L[found1];
            console.log("max", max);
            for (let i = 0; i < max; i++) {
              //if (safety-- < 0) break;
              
              //if (i < L[found1]) {
                // toggle
                workers[toggle].push(found1);
              //}
              // && i < (max - 1)
              if (allfound.length === 1 && workers[(toggle + 1) % workers.length].length < workers[toggle].length) {
                workers[(toggle + 1) % workers.length].push(".");
              }
              //if (found2 === null) {
              //  workers[1].push(".");
              //} else if (i < L[found2]) {
              //  workers[1].push(found2);
              //}
            }
            
            sorted.push(found1);

            remaining_steps.forEach((s, idx) => {
              console.log("found1", idx, found1, s[0], s[0] === found1);
              if (s[0] === found1) {
                
                remaining_steps[idx] = [ s[1], null ];
                console.log("shifted", idx, remaining_steps[idx]);
              }
            });
            
            //if (found2 !== null) {
            //  sorted.push(found2);
            //  remaining_steps.forEach((s, idx) => {
            //    //console.log("found2", found2, s[0]);
            //    if (s[0] === found2) {
            //      remaining_steps[idx] = [ s[1], null ];
            //    }
            //  });
            //}

            // remove null steps
            let nullIndex = remaining_steps.findIndex(s => s[0] === null && s[1] === null);
            while (nullIndex > -1) {
              console.log("nullIndex", nullIndex);
              remaining_steps.splice(nullIndex, 1);
              nullIndex = remaining_steps.findIndex(s => s[0] === null && s[1] === null);
            }
          }
          toggle = (toggle + 1) % workers.length;
        }
        
        console.log(workers);

        // 233 is too low
        //TODO: fix
        return Math.max(workers[0].length, workers[1].length);
      }
    },
    "day8": {
      "part1": data => {
        const data1 = data.trim().split(" ");
        let header = data1.map(Number);
        
        let total = 0;
        
        const calcMeta = function (chunk, nodeCount) {
          if (chunk.length > 0 && nodeCount > 0) {
            let childCount = chunk.shift();
            let metaCount = chunk.shift();
            
            for (let c = 0; c < childCount; c++) {
              // process children before getting metadata
              calcMeta(chunk, childCount);
            }
            
            for (let m = 0; m < metaCount; m++) {
              let metaVal = chunk.shift();
              total += metaVal;
            }
          }
          return;
        }
        
        calcMeta(header, 1);
        
        return total;
      },
      "part2": data => {
        const data2 = data.trim().split(" ");
        let header = data2.map(Number);
        
        let total = 0;
        
        const calcMeta = function (chunk, nodeCount) {
          let nodeVal = 0;
          if (chunk.length > 0 && nodeCount > 0) {
            let childCount = chunk.shift();
            let metaCount = chunk.shift();
            
            let childVals = [];
            for (let c = 0; c < childCount; c++) {
              // process children before getting metadata
              childVals[c] = calcMeta(chunk, childCount);
            }
            
            for (let m = 0; m < metaCount; m++) {
              let metaVal = chunk.shift();
              if (childCount === 0) {
                nodeVal += metaVal;
              } else if (metaVal <= childCount) {
                nodeVal += childVals[metaVal - 1];
              }
            }
          }
          return nodeVal;
        }
        
        total = calcMeta(header, 1);
        
        return total;
      }
    },
    "day9": {
      "part1": data => {
        const parse = /(\d+) players; last marble is worth (\d+) points/;
        const data1 = data.trim();
        
        const parsed = data1.match(parse).map(Number);
        const playerCount = parsed[1];
        const last = parsed[2];
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
        
        return top;
      },
      "part2": data => {
        const parse5 = /(\d+) players; last marble is worth (\d+) points/;
        
        const parsed = data.match(parse5).map(Number);
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

        return top;
      }
    },
    "day10": {
      "part1": data => {
        const parse = /position=\<\s*(-?\d+),\s*(-?\d+)\>\s+velocity=\<\s*(-?\d+),\s*(-?\d+)\>/;
        //                            1 x        2 y                       3 dx       4 dy
        const data1 = data.trim().split("\n");
        const points = data1.map(p => {
          let parsed = p.match(parse).map(Number);
          return {
            // origin
            ox: parsed[1],
            oy: parsed[2],
            // moving
            dx: parsed[3],
            dy: parsed[4],
            // current
            cx: parsed[1],
            cy: parsed[2]
          };
        });
        
        let i = 0;

        while (points.some(p => p.cx < 0 || p.cy < 0)) {
          points.forEach(p => {
            p.cx += p.dx;
            p.cy += p.dy;
          });
          i++;
        }
        
        console.log(i, points);
        // 10054
        
        // lets try 50
        for (let x = 0; x < 50; x++) {
          let maxX = Math.max(...points.map(p => p.cx)) + 2;
          let maxY = Math.max(...points.map(p => p.cy)) + 2;
          //let tabula_rasa = Array(maxY + 1).fill(Array(maxX + 1).fill("."));
          let plot = points.reduce((arr, p) => {
            let x = p.cx + 1;
            let y = p.cy + 1;
            //console.log(p.cy, maxY);
            if (y > 0 && x > 0) {
              arr[y] = arr[y] || Array(maxX).fill(".");
              arr[y][x] = "#";
            }
            
            return arr;
          }, []).filter(p => p && p.length > 0).map(p => p.join("")).join("\n");
          console.log((i + x) + "\n" + plot);
          
          points.forEach(p => {
            p.cx += p.dx;
            p.cy += p.dy;
          });
        }
        //console.log(points);
        
        return "look in the console";
      },
      "part2": data => {
        console.log("just paste it into part 1");
        return "see part 1's console message";
      }
    },
    "day11": {
      "part1": data => {
      },
      "part2": data => {
      }
    },
    "day12": {
      "part1": data => {
      },
      "part2": data => {
      }
    },
    "day13": {
      "part1": data => {
      },
      "part2": data => {
      }
    },
    "day14": {
      "part1": data => {
      },
      "part2": data => {
      }
    },
    "day15": {
      "part1": data => {
      },
      "part2": data => {
      }
    },
    "day16": {
      "part1": data => {
        const parser = /Before:\s+\[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]\n(-?\d+) (-?\d+) (-?\d+) (-?\d+)\nAfter:\s+\[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]/;
        const i = {
          addr: (r,a,b,c) => r[c] = r[a] + r[b],
          addi: (r,a,b,c) => r[c] = r[a] + b,
          mulr: (r,a,b,c) => r[c] = r[a] * r[b],
          muli: (r,a,b,c) => r[c] = r[a] * b,
          banr: (r,a,b,c) => r[c] = r[a] & r[b],
          bani: (r,a,b,c) => r[c] = r[a] & b,
          borr: (r,a,b,c) => r[c] = r[a] | r[b],
          bori: (r,a,b,c) => r[c] = r[a] | b,
          setr: (r,a,b,c) => r[c] = r[a],
          seti: (r,a,b,c) => r[c] = a,
          gtir: (r,a,b,c) => r[c] = a > r[b] ? 1 : 0,
          gtri: (r,a,b,c) => r[c] = r[a] > b ? 1 : 0,
          gtrr: (r,a,b,c) => r[c] = r[a] > r[b] ? 1 : 0,
          eqir: (r,a,b,c) => r[c] = a === r[b] ? 1 : 0,
          eqri: (r,a,b,c) => r[c] = r[a] === b ? 1 : 0,
          eqrr: (r,a,b,c) => r[c] = r[a] === r[b] ? 1 : 0
        };
        
        const parts = data.trim().split("\n\n\n\n");
        const first = parts[0].split("\n\n").map(c => {
          console.log(c);
          let o = c.match(parser).slice(1).map(Number);
          return {
            before: o.slice(0,4),
            func: o.slice(4,8),
            after: o.slice(8)
          }
        });
        //const second = parts[1].split("\n").map(l => l.split(" ").map(Number) );
        
        let poop = [];
        first.forEach(fart => {
          let eq = 0;
          Object.keys(i).forEach(k => {
            let r = fart.before.slice();
            i[k](r, fart.func[1], fart.func[2], fart.func[3]);
            let test = r.reduce((test, v, idx) => test && (v === fart.after[idx]), true);
            if (test) {
              eq++;
            }
          });
          poop.push(eq);
        });
        
        let answer = poop.filter(turd => turd >= 3).length;
        return answer;
      },
      "part2": data => {
        const parser = /Before:\s+\[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]\n(-?\d+) (-?\d+) (-?\d+) (-?\d+)\nAfter:\s+\[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]/;
        const i = {
          addr: (r,a,b,c) => r[c] = r[a] + r[b],
          addi: (r,a,b,c) => r[c] = r[a] + b,
          mulr: (r,a,b,c) => r[c] = r[a] * r[b],
          muli: (r,a,b,c) => r[c] = r[a] * b,
          banr: (r,a,b,c) => r[c] = r[a] & r[b],
          bani: (r,a,b,c) => r[c] = r[a] & b,
          borr: (r,a,b,c) => r[c] = r[a] | r[b],
          bori: (r,a,b,c) => r[c] = r[a] | b,
          setr: (r,a,b,c) => r[c] = r[a],
          seti: (r,a,b,c) => r[c] = a,
          gtir: (r,a,b,c) => r[c] = a > r[b] ? 1 : 0,
          gtri: (r,a,b,c) => r[c] = r[a] > b ? 1 : 0,
          gtrr: (r,a,b,c) => r[c] = r[a] > r[b] ? 1 : 0,
          eqir: (r,a,b,c) => r[c] = a === r[b] ? 1 : 0,
          eqri: (r,a,b,c) => r[c] = r[a] === b ? 1 : 0,
          eqrr: (r,a,b,c) => r[c] = r[a] === r[b] ? 1 : 0
        };
        
        const parts = data.trim().split("\n\n\n\n");
        const first = parts[0].split("\n\n").map(c => {
          //console.log(c);
          let o = c.match(parser).slice(1).map(Number);
          return {
            before: o.slice(0,4),
            func: o.slice(4,8),
            after: o.slice(8)
          }
        });
        const second = parts[1].split("\n").map(l => l.split(" ").map(Number) );
        
        let iMap = {
          addr: -1,
          addi: -1,
          mulr: -1,
          muli: -1,
          banr: -1,
          bani: -1,
          borr: -1,
          bori: -1,
          setr: -1,
          seti: -1,
          gtir: -1,
          gtri: -1,
          gtrr: -1,
          eqir: -1,
          eqri: -1,
          eqrr: -1
        };
        // geez, do i even need this???
        let iMapPotato = {
          addr: { yes: [], no: [] },
          addi: { yes: [], no: [] },
          mulr: { yes: [], no: [] },
          muli: { yes: [], no: [] },
          banr: { yes: [], no: [] },
          bani: { yes: [], no: [] },
          borr: { yes: [], no: [] },
          bori: { yes: [], no: [] },
          setr: { yes: [], no: [] },
          seti: { yes: [], no: [] },
          gtir: { yes: [], no: [] },
          gtri: { yes: [], no: [] },
          gtrr: { yes: [], no: [] },
          eqir: { yes: [], no: [] },
          eqri: { yes: [], no: [] },
          eqrr: { yes: [], no: [] }
        };
        
        let poop = [];
        first.forEach(fart => {
          let eq = 0;
          let last = "";
          let potential = [];
          Object.keys(i).forEach(k => {
            if (iMap[k] === -1) {
              let r = fart.before.slice();
              i[k](r, fart.func[1], fart.func[2], fart.func[3]);
              let test = r.reduce((test, v, idx) => test && (v === fart.after[idx]), true);
              if (test) {
                eq++;
                last = k;
                potential.push({ k: k, idx: fart.func[0] });
                iMapPotato[k].yes.push(fart.func[0]);
              } else {
                iMapPotato[k].no.push(fart.func[0]);
              }
            }
          });
          if (eq === 1) {
            // shortcut
            console.log("shortcut: ", last, fart.func[0]);
            iMap[last] = fart.func[0];
          }
          poop.push(potential);
        });
        
        //console.log(iMap);
        //console.log(iMapPotato);
        //console.log(poop);
        //let answer = poop.filter(turd => turd === 1).length;
        
        /*
        Object.keys(iMapPotato).forEach(k => {
          if (iMap[k] === -1) {
            // reset yes & no to arrays of distinct items 
            iMapPotato[k].yes = [ ...new Set( iMapPotato[k].yes ) ];
            iMapPotato[k].no = [ ...new Set( iMapPotato[k].no ) ];
          } else {
            iMapPotato[k] = iMap[k];
          }
        });
        
        Object.keys(iMapPotato).forEach(k => {
          if (iMap[k] === -1) {
            // filter out values that don't appear in the no list
            iMapPotato[k].yes = iMapPotato[k].yes.filter(p => iMapPotato[k].no.indexOf(p) === -1);
            // also filter out values from yes that have already been assigned
            iMapPotato[k].yes = iMapPotato[k].yes.filter(p => Object.values(iMap).indexOf(p) === -1);
            
            if (iMapPotato[k].yes.length === 1) {
              iMap[k] = iMapPotato[k].yes[0];
              console.log(k, iMapPotato[k].yes);
            }
          }
        });
        */
        
        console.log("if any of these are -1 then uncomment the above code and debug: ", iMap);
        
        let flip = [];
        Object.keys(iMap).forEach(k => flip[iMap[k]] = k);
        
        console.log("flipped: ", flip);

        let r = [ 0, 0, 0, 0 ];
        
        second.forEach(s => {
          i[flip[s[0]]](r, s[1], s[2], s[3]);
        });
        
        console.log(r);
        
        return r[0];
      }
    },
    "day17": {
      "part1": data => {
        const parse = /([xy])=(\d+), ([xy])=(\d+)\.\.(\d+)/;
        //              1      2      3      4        5
        const spring = { x: 500, y: 0 };
        
        const clay = data.trim().split('\n').map(c => {
          const parsed = c.match(parse);
          let block = {
            xmin: 0,
            xmax: 0,
            ymin: 0,
            ymax: 0
          };
          
          let first = parsed[1];
          block[first + "min"] = Number(parsed[2]);
          block[first + "max"] = block[first + "min"];
          
          let second = parsed[3];
          block[second + "min"] = Number(parsed[4]);
          block[second + "max"] = Number(parsed[5]);
          
          return block;
        });
        const ymin = Math.min(spring.y, ...clay.map(b => b.ymin));
        const ymax = Math.max(spring.y, ...clay.map(b => b.ymax))+1;
        const xmin = Math.min(spring.x, ...clay.map(b => b.xmin));
        const xmax = Math.max(spring.x, ...clay.map(b => b.xmax))+1;
        const grid = clay.reduce((g,b) => {
          for (let y = b.ymin; y <= b.ymax; y++) {
            g[y] = g[y] || new Array(xmax).fill(0);
            for (let x = b.xmin; x <= b.xmax; x++) {
              g[y][x] = 1;
            }
          }
          return g;
        }, new Array(ymax));
        
        //console.log(clay, ymin, ymax, xmin, xmax);
        
        let water = new Array(ymax);
        //console.log(grid, water);
        
        let xs = [ spring.x ];
        let x = spring.x;
        let safety = 100;
        //let movingDown = true;
        for (let y = spring.y + 1; y <= ymax; y++) {
          if (safety-- < 0) break;
          
          let badx = [];
          water[y] = water[y] || new Array(xmax).fill(0);
          
          //xs.forEach((x, idx) => {
            //if (water[y][x]) {
              // already water, 
              //console.log("water at x:" + x + ", y:" + y);
            //} //else
            if ((!grid[y] || !grid[y][x]) && !water[y][x]) {
              // no clay, no water
              water[y][x] = 1;
            } else {
              // clay, remove x?
              //badx.push(x);
              
              // move back up and spread
              if (y > 1) {
                y--;
                let left = true;
                let right = true;

                for (let spread = 1; spread < xmax; spread++) {
                  if ((x - spread) < 0) {
                    left = false;
                  } 
                  if (left) {
                    if (!grid[y] || !grid[y][x - spread]) {
                      // no clay
                      water[y][x - spread] = 1;
                      // check under
                      if (!grid[y + 1] || !grid[y + 1][x - spread]) {
                        // no clay
                        water[y + 1][x - spread] = 1;
                        xs.push(x - spread);
                        left = false;
                      }
                    } else {
                      left = false;
                    }
                  }
                  if ((x + spread) > xmax) {
                    right = false;
                  } 
                  if (right) {
                    if (!grid[y] || !grid[y][x + spread]) {
                      // no clay
                      water[y][x + spread] = 1;
                      // check under
                      if (!grid[y + 1] || !grid[y + 1][x + spread]) {
                        // no clay
                        water[y + 1][x + spread] = 1;
                        xs.push(x + spread);
                        right = false;
                      }
                    } else {
                      right = false;
                    }
                  }
                  if (!left && !right) {
                    // finished spreading, raise water
                    console.log(y);
                    y--;
                    break;
                  }
                }
              }
            }
          //});
          
          if (badx.length > 0) {
            badx.forEach(xx => xs.splice(xx, 1));
          }
        }
        
        console.log(safety, 
                    "\n" + grid.slice(ymin).map(r => r !== undefined ? r.slice(xmin).map(b => !!b ? '#' : '.').join("") : new Array(xmax - xmin).fill(".").join("")).join('\n') + 
                    "\n" + water.slice(ymin).map(r => r.slice(xmin).map(w => !!w ? '~' : '.').join("")).join('\n'));
        
        return water.reduce((rsum, r) => rsum + r.reduce((sum, w) => sum + w, 0), 0);
      },
      "part2": data => {
      }
    },
    "day18": {
      "part1": data => {
        const input = data.trim().split("\n").map(r => r.split(""));
        
        // # 2
        const LUMBER = 2;
        // | 1
        const TREES = 1;
        // . 0
        const EMPTY = 0
        
        let grid = input.map(r => r.map(c => c === "." ? EMPTY : c === "|" ? TREES : 2));
        const MINUTES = 10;
        
        for (let minute = 0; minute < MINUTES; minute++) {
          let next = [];
          for (let y = 50; y--;) {
            next[y] = next[y] || [];
            
            for (let x = 50; x--;) {
              next[y][x] = grid[y][x];
              
              //for (let yy = y - 1; yy < (y + 1); y++) {
              //  for (let xx = x - 1; xx < (x + 1); x++) {
              //    if (xx !== x && yy !== y){}
              //  }
              //}
              
              let a,b,c,
                  d,  e,
                  f,g,h;
              
              a=y-1>=0&&x-1>=0?grid[y-1][x-1]:-1;
              b=y-1>=0?grid[y-1][x]:-1;
              c=y-1>=0&&x+1<50?grid[y-1][x+1]:-1;
              d=x-1>=0?grid[y][x-1]:-1;
              e=x+1<50?grid[y][x+1]:-1;
              f=y+1<50&&x-1>=0?grid[y+1][x-1]:-1;
              g=y+1<50?grid[y+1][x]:-1;
              h=y+1<50&&x+1<50?grid[y+1][x+1]:-1;
              
              const surround = [a,b,c,
                                d,  e,
                                f,g,h];
                    
              if (grid[y][x] === EMPTY && surround.filter(s => s === TREES).length >= 3) {
                next[y][x] = TREES;
              } else if (grid[y][x] === TREES && surround.filter(s => s === LUMBER).length >= 3) {
                next[y][x] = LUMBER;
              } else if (grid[y][x] === LUMBER) {
                if (surround.filter(s => s === LUMBER).length >= 1 && surround.filter(s => s === TREES).length >= 1) {
                  next[y][x] = LUMBER;
                } else {
                  next[y][x] = EMPTY;
                }
              }
            }
          }
          grid = next;
        }
      
        const counts = grid.reduce((yCounts, y) => {
          y.forEach(x => {
            yCounts[x]++;
          });
          return yCounts;
        }, [0, 0, 0]);
        return counts[TREES] * counts[LUMBER];
      },
      "part2": data => {
        const input = data.trim().split("\n").map(r => r.split(""));
        
        // # 2
        const LUMBER = 2;
        // | 1
        const TREES = 1;
        // . 0
        const EMPTY = 0
        
        let grid = input.map(r => r.map(c => c === "." ? EMPTY : c === "|" ? TREES : 2));
        
        const startcounts = grid.reduce((yCounts, y) => {
          y.forEach(x => {
            yCounts[x]++;
          });
          return yCounts;
        }, [0, 0, 0]);
        
        const start = startcounts[TREES] * startcounts[LUMBER];
        console.log(start);
        
        const MINUTES = 1000000000;
        
        let minute;
        for (minute = 0; minute < MINUTES; minute++) {
          let next = [];
          for (let y = 50; y--;) {
            next[y] = next[y] || [];
            
            for (let x = 50; x--;) {
              next[y][x] = grid[y][x];
              
              //for (let yy = y - 1; yy < (y + 1); y++) {
              //  for (let xx = x - 1; xx < (x + 1); x++) {
              //    if (xx !== x && yy !== y){}
              //  }
              //}
              
              let a,b,c,
                  d,  e,
                  f,g,h;
              
              a=y-1>=0&&x-1>=0?grid[y-1][x-1]:-1;
              b=y-1>=0?grid[y-1][x]:-1;
              c=y-1>=0&&x+1<50?grid[y-1][x+1]:-1;
              d=x-1>=0?grid[y][x-1]:-1;
              e=x+1<50?grid[y][x+1]:-1;
              f=y+1<50&&x-1>=0?grid[y+1][x-1]:-1;
              g=y+1<50?grid[y+1][x]:-1;
              h=y+1<50&&x+1<50?grid[y+1][x+1]:-1;
              
              const surround = [a,b,c,
                                d,  e,
                                f,g,h];
                    
              if (grid[y][x] === EMPTY && surround.filter(s => s === TREES).length >= 3) {
                next[y][x] = TREES;
              } else if (grid[y][x] === TREES && surround.filter(s => s === LUMBER).length >= 3) {
                next[y][x] = LUMBER;
              } else if (grid[y][x] === LUMBER) {
                if (surround.filter(s => s === LUMBER).length >= 1 && surround.filter(s => s === TREES).length >= 1) {
                  next[y][x] = LUMBER;
                } else {
                  next[y][x] = EMPTY;
                }
              }
            }
          }
          grid = next;
          
          // look for a repeat...
          const counts = grid.reduce((yCounts, y) => {
            y.forEach(x => {
              yCounts[x]++;
            });
            return yCounts;
          }, [0, 0, 0]);

          const finish = counts[TREES] * counts[LUMBER];
          
          // repeating?
          if (start === finish) {
            console.log(start, finish, minute);
            break;
          }
          
          if (minute % (MINUTES / 10000) === 0) {
            console.log((minute * 100 / MINUTES) + "%");
          }
        }
        
        return "repeating at minute:" + minute; 
      }
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
  
}).call(this);
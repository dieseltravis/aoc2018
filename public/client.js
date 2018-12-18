//import funs from "/funs.js";

const process = function (funs, day, part) {
  const timer = "day " + day + ", part " + part;
  const input = document.getElementById("input" + part);
  const answer = document.getElementById("part" + part);
  const button = document.getElementById("button" + part);
  const onevent = function (ev) {
    // put function in a timeout so that it doesn't block UI thread
    setTimeout(function () {
      console.time(timer);

      // fun time
      answer.innerText = funs(day, part)(input.value);
      
      console.timeEnd(timer);
    }, 20);
  };

  //input.addEventListener("change", onevent);
  button.addEventListener("click", onevent);
};

const day = function (funs, day) {
  process(funs, day, 1);
  process(funs, day, 2);
};

export default day;

/*
const input1 = document.getElementById("input1");
const part1 = document.getElementById('part1');
const input2 = document.getElementById("input2");
const part2 = document.getElementById('part2');
*/
//
/*var change = new UIEvent("change", {
    "view": window,
    "bubbles": true,
    "cancelable": true
});
const getInput1 = document.querySelector("#input1 + a");
getInput1.addEventListener("click", ev => {
  ev.preventDefault();
  //const day = getInput1.href.split("/")[5];
  console.log(getInput1.href);
  fetch(getInput1.href, {
    method: "GET",
    mode: "no-cors"
  })
    .then(blob => blob.text())
    .then(data => {
      input1.value = data;
      input1.dispatchEvent(change);
    });
  
});
// damn cors^
*/

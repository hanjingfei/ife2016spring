var depthTravBtn = document.getElementById("depth-first-btn");
var breadthTravBtn = document.getElementById("breadth-first-btn");
var depthQueryBtn = document.getElementById("depth-first-query-btn");
var breadthQueryBtn = document.getElementById("breadth-first-query-btn");
var queryText = document.getElementById("query-text");
var rootBox = document.getElementById("root-box");

var boxQueue = new Array();
var matchQueue = new Array();
var colorQueue = new Array();
var stackQueue = new Array();
var busyFlag = 0;
var foundFlag = 0;
var str_pat = "";
var colorFlash = "#aaa";
var colorNormal = "#fff";

function depthFirst(box, pat) {
  if(box) {
    boxQueue.push(box);
    var tmp = box.childNodes[0].textContent.trim();
    console.log(tmp);
    matchQueue.push(tmp == pat);
    if(tmp == pat) {
      foundFlag = 1;
      colorQueue.push(box);
    }
    var child = box.firstElementChild;
    depthFirst(child, pat);
    for (var i = 1; i < box.childElementCount; i++) {
      depthFirst(child.nextElementSibling, pat);
      child = child.nextElementSibling;
    }
  }
}

function breadthFirst(box, pat) {
  if(box) {
    stackQueue.push(box);
  }
  while(stackQueue.length > 0) {
    var root = stackQueue.shift();
    boxQueue.push(root);
    var tmp = root.childNodes[0].textContent.trim();
    matchQueue.push(tmp == pat);
    if(tmp == pat) {
      foundFlag = 1;
      colorQueue.push(root);
    }
    var child = root.firstElementChild;
    if(child) {
      stackQueue.push(child);
    }
    for (var i = 1; i < root.childElementCount; i++) {
      child = child.nextElementSibling;
      stackQueue.push(child);
    }
  }
}
function clearRender() {
  //clear last query results firstly
  for (var j = 0; j < colorQueue.length; j++) {
    colorQueue[j].style.background = colorNormal;
  }
  colorQueue = [];
}

function renderBox(time_i, disColor) {
  var i = 0;
  boxQueue[i].style.background = colorFlash;
  var t = setInterval(function() {
    if(i < (boxQueue.length - 1)) {
      if(!matchQueue[i] || disColor) {
        boxQueue[i].style.background = colorNormal;
      }
      boxQueue[i+1].style.background = colorFlash;
    } else if(i == (boxQueue.length -1)) {
      if(!matchQueue[i] || disColor) {
        boxQueue[i].style.background = colorNormal;
      }
      clearInterval(t);
      busyFlag = 0;
      if(!foundFlag && (str_pat != "") && (!disColor)) {
        alert("Pattern: [" + str_pat + "] Not found !");
      }
      foundFlag = 0;
      queryText.focus();
      queryText.select();
    }
    i++;
  }, time_i);
}

function initButtonEvent() {
  depthTravBtn.addEventListener("click", function (event) {
    console.log("button click: " + event.target.id);
    if(busyFlag) {
      console.log("busy !");
    } else {
      busyFlag = 1;
      boxQueue = [];
      matchQueue = [];
      clearRender();
      depthFirst(rootBox, "");
      renderBox(500, true);
    }
  });
  breadthTravBtn.addEventListener("click", function (event) {
    console.log("button click: " + event.target.id);
    if(busyFlag) {
      console.log("busy !");
    } else {
      busyFlag = 1;
      boxQueue = [];
      matchQueue = [];
      clearRender();
      breadthFirst(rootBox, "");
      renderBox(500, true);
    }
  });
  depthQueryBtn.addEventListener("click", function (event) {
    console.log("button click: " + event.target.id);
    if(busyFlag) {
      console.log("busy !");
    } else {
      str_pat = queryText.value.trim();
      busyFlag = 1;
      boxQueue = [];
      matchQueue = [];
      clearRender();
      depthFirst(rootBox, str_pat);
      renderBox(500);
    }
  });
  breadthQueryBtn.addEventListener("click", function (event) {
    console.log("button click: " + event.target.id);
    if(busyFlag) {
      console.log("busy !");
    } else {
      str_pat = queryText.value.trim();
      busyFlag = 1;
      boxQueue = [];
      matchQueue = [];
      clearRender();
      breadthFirst(rootBox, str_pat);
      renderBox(500);
    }
  });
}

function init() {
  initButtonEvent();
  busyFlag = 0;
  foundFlag = 0;
}

init();

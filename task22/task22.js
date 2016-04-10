var preOrderBtn = document.getElementById("pre-order-btn");
var inOrderBtn = document.getElementById("in-order-btn");
var postOrderBtn = document.getElementById("post-order-btn");
var rootBox = document.getElementById("root-box");

var boxQueue = new Array();
var busyFlag = 0;
var colorFlash = "#aaa";
var colorNormal = "#fff";

function preOrder(box) {
  boxQueue.push(box);
  if(box.firstElementChild) {
    preOrder(box.firstElementChild);
  }
  if(box.lastElementChild) {
    preOrder(box.lastElementChild);
  }
}

function renderBox() {
  var i = 0;
  boxQueue[i].style.background = colorFlash;
  var t = setInterval(function() {
    if(i < (boxQueue.length - 1)) {
      boxQueue[i].style.background = colorNormal;
      boxQueue[i+1].style.background = colorFlash;
    } else if(i == (boxQueue.length -1)) {
      boxQueue[i].style.background = colorNormal;
      clearInterval(t);
    }
    i++;
  }, 500);
}

function initButtonEvent() {
  preOrderBtn.addEventListener("click", function (event) {
    console.log("button click: " + event.target.id);
    if(busyFlag) {
      console.log("busy !");
      return;
    }
    busyFlag = 1;
    boxQueue = [];
    preOrder(rootBox);
    renderBox();
    busyFlag = 0;
  });
}

function init() {
  initButtonEvent();
}

init();

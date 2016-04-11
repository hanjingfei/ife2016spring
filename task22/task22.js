var preOrderBtn = document.getElementById("pre-order-btn");
var inOrderBtn = document.getElementById("in-order-btn");
var postOrderBtn = document.getElementById("post-order-btn");
var rootBox = document.getElementById("root-box");

var boxQueue = new Array();
var busyFlag = 0;
var colorFlash = "#aaa";
var colorNormal = "#fff";

function preOrder(box) {
  if(box) {
    boxQueue.push(box);
    preOrder(box.firstElementChild);
    preOrder(box.lastElementChild);
  }
}

function inOrder(box) {
  if(box) {
    inOrder(box.firstElementChild);
    boxQueue.push(box);
    inOrder(box.lastElementChild);
  }
}

function postOrder(box) {
  if(box) {
    postOrder(box.firstElementChild);
    postOrder(box.lastElementChild);
    boxQueue.push(box);
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
      busyFlag = 0;
    }
    i++;
  }, 500);
}

function initButtonEvent() {
  preOrderBtn.addEventListener("click", function (event) {
    console.log("button click: " + event.target.id);
    if(busyFlag) {
      console.log("busy !");
    } else {
      busyFlag = 1;
      boxQueue = [];
      preOrder(rootBox);
      renderBox();
    }
  });
  inOrderBtn.addEventListener("click", function (event) {
    console.log("button click: " + event.target.id);
    if(busyFlag) {
      console.log("busy !");
    } else {
      busyFlag = 1;
      boxQueue = [];
      inOrder(rootBox);
      renderBox();
    }
  });
  postOrderBtn.addEventListener("click", function (event) {
    console.log("button click: " + event.target.id);
    if(busyFlag) {
      console.log("busy !");
    } else {
      busyFlag = 1;
      boxQueue = [];
      postOrder(rootBox);
      renderBox();
    }
  });
}

function init() {
  initButtonEvent();
}

init();

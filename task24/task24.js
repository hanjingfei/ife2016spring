var delBoxBtn = document.getElementById("del-box-btn");
var addBoxBtn = document.getElementById("add-box-btn");
var newBoxName = document.getElementById("new-box-name");
var rootBox = document.getElementById("root-box");
var containerDiv = document.getElementById("container");

var selectedBox = null;

var boxQueue = new Array();
var matchQueue = new Array();
var colorQueue = new Array();
var stackQueue = new Array();
var busyFlag = 0;
var foundFlag = 0;
var str_pat = "";
var colorFlash = "#aaa";
var colorNormal = "#fff";
var colorClick = "#7FFFD4";

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
      newBoxName.focus();
      newBoxName.select();
    }
    i++;
  }, time_i);
}

function initButtonEvent() {
  delBoxBtn.onclick = function() {
    for (var j = 0; j < colorQueue.length; j++) {
      var tmp = colorQueue[j].parentNode;
      tmp.removeChild(colorQueue[j]);
      if(colorQueue[j] != rootBox) {
        breadthFirst(rootBox, ""); //rebuild tree
      } else {
        //the whole tree del
        boxQueue = [];
      }
    }
    newBoxName.focus();
    newBoxName.select();
  }
  addBoxBtn.onclick = function() {
    var boxName = newBoxName.value.trim();
    if(boxName != "") {
      if(selectedBox != null) {
        var newBox = document.createElement('div');
        newBox.innerHTML = boxName;
        if(selectedBox == containerDiv) {
          //root
          if(selectedBox.childElementCount >= 1) {
            alert("根节点只能有一个！");
          } else {
            newBox.className = "root";
            //newBox.style.height = 300;
            selectedBox.appendChild(newBox);
          }
        } else {
          //child elements
          newBox.className = "child";
          //newBox.style.height = selectedBox.clientHeight - 40;
          selectedBox.appendChild(newBox);
        }
      } else {
        alert("添加新节点之前请选择其父节点！");
      }
    } else {
      alert("新节点名字不能为空！");
    }
    newBoxName.focus();
    newBoxName.select();
  }
  //only one body in this page
  containerDiv.onclick = function(event) {
    console.log("click on: " + event.target.nodeName + " " + event.target.childNodes[0].textContent);
    if(event.target.nodeName == "DIV") {
      clearRender(); //remove last select box
      selectedBox = event.target;
      if(event.target.id != "container") {
        selectedBox.style.background = colorClick;
        colorQueue.push(selectedBox);
      }
    }
    newBoxName.focus();
    newBoxName.select();
  }
}

function init() {
  initButtonEvent();
  busyFlag = 0;
  foundFlag = 0;
  breadthFirst(rootBox, ""); //build tree
}

init();

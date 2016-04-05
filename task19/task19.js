var numQueue = new Array();
var tmpQueue = new Array();
var oriQueue = new Array();
var queueBox = document.getElementById("queue-box");
var dataBox = document.getElementById("data-box");
var queueGraph = document.getElementById("queue-graph");
var numInput = document.getElementById("num-input");
var max_array_length = 10;
var count = 0;

function leftInQueue(data) {
  var tmp = new Array();
  tmp[0] = data;
  for (var i = 0; i < numQueue.length; i++) {
    tmp[i+1] = numQueue[i];
  }
  numQueue = tmp;
}
function rightInQueue(data) {
  numQueue.push(data);
}
//insert data in curIndex(data < [curIndex])
function insertQueue(data, curIndex) {
  var tmp = numQueue[curIndex];
  numQueue.splice(curIndex,1,data,tmp);
}
function leftInBtnHandle() {
  var tmp = new Array();
  var left_in_data = numInput.value;
  console.log("left_in_data = " + left_in_data);
  if (numQueue.length >= max_array_length) {
    alert("队列数据超过最大数量：" + max_array_length);
    numInput.focus();
    numInput.select();
  } else if ((left_in_data < 10) || (left_in_data > 100)) {
    alert("输入数据必须介于10~100之间，当前输入为：" + left_in_data);
    numInput.focus();
    numInput.select();
  } else {
    leftInQueue(left_in_data);
    renderQueue();
  }
}
function leftOutBtnHandle() {
  if(numQueue.length > 0) {
    var tmp = new Array();
    var left_out_data = numQueue[0];
    console.log("left_out_data = " + left_out_data);
    for (var i = 1; i < numQueue.length; i++) {
      tmp[i-1] = numQueue[i];
    }
    numQueue = tmp;
    renderQueue();
    alert("删除左侧第一个元素: " + left_out_data);
  }
}
function rightInBtnHandle() {
  var right_in_data = numInput.value;
  console.log("right_in_data = " + right_in_data);
  if (numQueue.length >= max_array_length) {
    alert("队列数据超过最大数量：" + max_array_length);
    numInput.focus();
    numInput.select();
  } else if ((right_in_data < 10) || (right_in_data > 100)) {
    alert("输入数据必须介于10~100之间，当前输入为：" + right_in_data);
    numInput.focus();
    numInput.select();
  } else {
    rightInQueue(right_in_data);
    renderQueue();
  }
}
function rightOutBtnHandle() {
  var right_out_data;
  if(numQueue.length > 0) {
    right_out_data= numQueue.pop();
    console.log("right_out_data = " + right_out_data);
    renderQueue();
    alert("删除右侧第一个元素: " + right_out_data);
  }
}
function delBoxHandle(id) {
  if(numQueue.length > 0) {
    var delData = numQueue[id];
    console.log("delData = " + delData);
    numQueue.splice(id, 1);
    renderQueue();
  }
}

//generate 60 rand numbers between 10 and 100
function randGenBtnHandle() {
  var tmp = 0;
  numQueue = [];//clear array before rand-gen
  for (var i = 0; i < max_array_length; i++) {
    while (tmp < 10) {
      tmp = Math.ceil(Math.random() * 100);
    }
    numQueue[i] = tmp;
    tmp = 0;
  }
  renderQueue();
}

function insertSortBtnHandle() {
  var t;
  var i = 0;
  tmpQueue = numQueue;
  oriQueue = [];
  oriQueue = numQueue;

  numQueue = [];
  numQueue[i] = tmpQueue[i];
  console.log("insertOne: " + tmpQueue[i] + "; Times: " + i);
  oriQueue.shift();
  i++;
  insertSortBtnHandle.insertOne = function() {
    renderQueue();
    for (var j = 0; j < i;j++) {
      if ((numQueue.length == 1) || (j == (numQueue.length - 1))) {
      //corner elements
        if(tmpQueue[i] > numQueue[j]) {
            rightInQueue(tmpQueue[i]);
        } else {
            insertQueue(tmpQueue[i], j);
        }
      } else {
      //normal(middle) elements
        if (tmpQueue[i] <= numQueue[j]) {
          insertQueue(tmpQueue[i], j);
          break;
        } else if ((tmpQueue[i] > numQueue[j]) && (tmpQueue[i] <= numQueue[j+1])) {
          insertQueue(tmpQueue[i], (j+1));
          break;
        }
      }
    }
    console.log("insertOne: " + tmpQueue[i] + "; Times: " + i);
    oriQueue.shift();
    i++;
    if (i >= (tmpQueue.length)) {
      clearInterval(t);
      renderQueue();
    }
  } //insertOne
  t = setInterval("insertSortBtnHandle.insertOne()",500);
}

function initButtonEvent() {
  document.getElementById("left-in").addEventListener("click", function () {
    leftInBtnHandle();
  });
  document.getElementById("left-out").addEventListener("click", function () {
    leftOutBtnHandle();
  });
  document.getElementById("right-in").addEventListener("click", function () {
    rightInBtnHandle();
  });
  document.getElementById("right-out").addEventListener("click", function () {
    rightOutBtnHandle();
  });
  document.getElementById("rand-gen").addEventListener("click", function () {
    randGenBtnHandle();
  });
  document.getElementById("insert-sort").addEventListener("click", function () {
    insertSortBtnHandle();
  });
  queueBox.addEventListener("click", function (event) {
    if(event.target.id.match(/^[0-9]+$/)) {
      console.log("call delBoxHandle: " + event.target.id);
      delBoxHandle(event.target.id);
    }
  });
  queueGraph.addEventListener("click", function (event) {
    if(event.target.id.match(/^[0-9]+$/)) {
      console.log("call delBoxHandle: " + event.target.id);
      delBoxHandle(event.target.id);
    }
  });
}

function renderQueue() {
  var outStr = "";
  var oriHTML = "";
  var textHTML = "";
  var graphHTML = "";
  var totalWidth = queueGraph.clientWidth - 100;
  queueGraph.style.height = 330;
  queueGraph.style.backgroundColor = "#eee";
  queueGraph.style.position = "relative";
  for (var i = 0; i < numQueue.length; i++) {
    outStr += (numQueue[i] + " ");
    textHTML += "<div id='";
    textHTML += i;
    textHTML += "' style = 'display: inline-block; margin: 5px; width: 30px; height: 30px; font-size: 20px; line-height: 30px; color: #ffffff; text-align:center; background-color: #ff0000'>";
    textHTML += numQueue[i];
    textHTML += "</div>";

    graphHTML += "<div id='";
    graphHTML += i;
    graphHTML += "' title='";
    graphHTML += numQueue[i];
    graphHTML += "' style = 'position: absolute; bottom: 0px; left:";
    graphHTML += i*15;
    graphHTML += "; width: 10px; height: ";
    graphHTML += numQueue[i]*3;
    graphHTML += "px; font-size: 30px; line-height: 50px; color: #ffffff; text-align:center; background-color: #ff0000'></div>";
  }
  for (var i = 0; i < oriQueue.length; i++) {
    oriHTML += "<div id='";
    oriHTML += i;
    oriHTML += "' style = 'display: inline-block; margin: 5px; width: 30px; height: 30px; font-size: 20px; line-height: 30px; color: #ffffff; text-align:center; background-color: #0000ff'>";
    oriHTML += oriQueue[i];
    oriHTML += "</div>";
  }
  console.log("numQueue is " + outStr);
  dataBox.innerHTML = oriHTML;
  queueBox.innerHTML = textHTML;
  queueGraph.innerHTML = graphHTML;
  numInput.focus();
  numInput.select();
  count++;
  //console.log("render count: " + count);
}

/**
 * 初始化函数
 */
function init() {
  initButtonEvent();
}

init();

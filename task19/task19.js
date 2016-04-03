var numQueue = new Array();
var queueBox = document.getElementById("queue-box");
var numIput = document.getElementById("num-input");
var max_array_length = 10;

function leftInBtnHandle() {
  var tmp = new Array();
  var left_in_data = numIput.value;
  console.log("left_in_data = " + left_in_data);
  if((left_in_data >= 10) && (left_in_data <= 100)) {
    tmp[0] = left_in_data;
    for (var i = 0; i < numQueue.length; i++) {
      tmp[i+1] = numQueue[i];
    }
    numQueue = tmp;
    renderQueue();
  } else {
    alert("输入数据必须介于10~100之间，当前输入为：" + left_in_data);
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
  var right_in_data = numIput.value;
  console.log("right_in_data = " + right_in_data);
  if((left_in_data >= 10) && (left_in_data <= 100)) {
    numQueue.push(right_in_data);
    renderQueue();
  } else {

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
}

function renderQueue() {
  var outStr = "";
  var textHTML = "";
  for (var i = 0; i < numQueue.length; i++) {
    outStr += (numQueue[i] + " ");
    textHTML += "<div id='";
    textHTML += i;
    textHTML += "' style = 'display: inline-block; margin: 10px; width: 50px; height: 50px; font-size: 30px; line-height: 50px; color: #ffffff; text-align:center; background-color: #ff0000'>";
    textHTML += numQueue[i];
    textHTML += "</div>";
  }
  console.log("numQueue is " + outStr);
  queueBox.innerHTML = textHTML;
  numIput.focus();
  numIput.select();
}

/**
 * 初始化函数
 */
function init() {
  initButtonEvent();
}

init();

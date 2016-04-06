var textQueue = new Array();
var colorQueue = new Array();
var queueBox = document.getElementById("queue-box");
var textInput = document.getElementById("text-input");
var queryText = document.getElementById("query-text");
var colorFlag = 0;

function text2array(text) {
  var strArray = text.split(/[^0-9a-zA-Z\u4E00-\u9FA5]+/);
  console.log("Each elements are " + strArray);
  return strArray;
}
function leftInBtnHandle() {
  var left_in_array = text2array(textInput.value);
  if(left_in_array.length > 0) {
    for (var i = 0; i < left_in_array.length; i++) {
      textQueue.unshift(left_in_array[i].trim());
    }
    console.log("left_in_array = " + left_in_array);
    renderQueue();
  }
}
function leftOutBtnHandle() {
  if(textQueue.length > 0) {
    var left_out_data = textQueue.shift();
    renderQueue();
    alert("删除左侧第一个元素: " + left_out_data);
  }
}
function rightInBtnHandle() {
  var right_in_array = text2array(textInput.value);
  if(right_in_array.length > 0) {
    for (var i = 0; i < right_in_array.length; i++) {
      textQueue.push(right_in_array[i].trim());
    }
    console.log("right_in_array = " + right_in_array);
    renderQueue();
  }
}
function rightOutBtnHandle() {
  if(textQueue.length > 0) {
    var right_out_data = textQueue.pop();
    console.log("right_out_data = " + right_out_data);
    renderQueue();
    alert("删除右侧第一个元素: " + right_out_data);
  }
}
function delBoxHandle(id) {
  if(textQueue.length > 0) {
    var delData = textQueue[id];
    console.log("delData = " + delData);
    textQueue.splice(id, 1);
    renderQueue();
  }
}
function queryBtnHandle() {
  var pat = "";
  var pat_str_new = "";
  var pat_str = queryText.value.trim();
  if(pat_str == "") {
    colorFlag = 0;
  } else {
    colorFlag = 1;
    colorQueue = textQueue.slice(0);
    pat = RegExp(pat_str, "g");
    console.log("pat is: " + pat);
    pat_str_new = "<span style = 'color: #0000FF'>" + pat_str + "</span>";
    for (var i = 0; i < colorQueue.length; i++) {
      colorQueue[i] = colorQueue[i].replace(pat, pat_str_new)
      console.log("colorQueue[] is " + colorQueue[i]);
    }
  }
  renderQueue();
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
  queueBox.addEventListener("click", function (event) {
    if(event.target.id.match(/^[0-9]+$/)) {
      console.log("call delBoxHandle: " + event.target.id);
      delBoxHandle(event.target.id);
    }
  });
  document.getElementById("query-btn").addEventListener("click", function () {
    queryBtnHandle();
  });
}

function renderQueue() {
  var outStr = "";
  var textHTML = "";
  for (var i = 0; i < textQueue.length; i++) {
    outStr += (textQueue[i] + " ");
    textHTML += "<div id='";
    textHTML += i;
    textHTML += "' style = 'display: inline-block; margin: 10px; height: 50px; font-size: 30px; line-height: 50px; color: #ffffff; text-align:center; background-color: #ff0000'>";
    textHTML += colorFlag ? colorQueue[i] : textQueue[i];
    textHTML += "</div>";
  }
  console.log("textQueue is " + outStr);
  queueBox.innerHTML = textHTML;
  textInput.focus();
  textInput.select();
  colorFlag = 0;
}

/**
 * 初始化函数
 */
function init() {
  initButtonEvent();
}

init();

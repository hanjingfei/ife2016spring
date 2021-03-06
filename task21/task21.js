var textQueue = new Array();
var tagQueue = new Array();
var tagBox = document.getElementById("tag-box");
var queueBox = document.getElementById("queue-box");
var tagInput = document.getElementById("tag-input");
var textInput = document.getElementById("text-input");
var textNumMax = 10;
var tagNumMax = 10;
var chineseIMEflag = 0;

function text2array(text) {
  var strArray = text.split(/[^0-9a-zA-Z\u4E00-\u9FA5]+/);
  console.log("Each elements are " + strArray);
  return strArray;
}
function delRep(ar) {
  var result = [];
  for(var i=0; i<ar.length; i++) {
    for(var j=i+1; j<ar.length; j++) {
      if(ar[i] === ar[j]) {
        j = ++i;
      }
    }
    result.push(ar[i]);
  }
  return result;
}
function okBtnHandle() {
  var left_in_array = text2array(textInput.value);
  if(left_in_array.length > 0) {
    for (var i = 0; i < left_in_array.length; i++) {
      if(left_in_array[i].trim() != "") {
        textQueue.unshift(left_in_array[i].trim());
      }
    }
    console.log("left_in_array = " + left_in_array);
    textQueue = delRep(textQueue);
    if(textQueue.length > textNumMax) {
      textQueue.splice(textNumMax, (textQueue.length-textNumMax));
    }
    renderQueue();
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
function delTagBoxHandle(id) {
  if(tagQueue.length > 0) {
    var delData = tagQueue[id];
    console.log("delTagData = " + delData);
    tagQueue.splice(id, 1);
    renderTag();
  }
}
function tagInputChangeHandle(event) {
  var left_in_word = "";
  var re_pat = new RegExp("[^0-9a-zA-Z\u4E00-\u9FA5]+");
  if((event.keyCode == 13) || re_pat.test(tagInput.value) && !chineseIMEflag) {
    left_in_word = tagInput.value.replace(re_pat, "");
    if(left_in_word.trim() != "") {
      tagQueue.unshift(left_in_word.trim());
      console.log("left_in_word: " + left_in_word);
    }
    tagQueue = delRep(tagQueue);
    if(tagQueue.length > tagNumMax) {
      tagQueue.splice(tagNumMax, (tagQueue.length-tagNumMax));
    }
    renderTag();
  }
}
function colorTagBoxHandle(id) {
  tagBox.childNodes[id].style.background = "#FF0000";
  tagBox.childNodes[id].innerHTML = "点击删除" + tagQueue[id];
}
function colorRemoveTagBoxHandle(id) {
  console.log("colorRemoveTagBoxHandle");
  renderTag();
}
function initButtonEvent() {
  queueBox.addEventListener("click", function (event) {
    if(event.target.id.match(/^[0-9]+$/)) {
      console.log("call delBoxHandle: " + event.target.id);
      delBoxHandle(event.target.id);
    }
  });
  tagInput.addEventListener("keyup", function (event) {
    console.log("keyup: tagInput.value=" + tagInput.value + "; keycode=" + event.keyCode);
    tagInputChangeHandle(event);
  });
  tagInput.addEventListener("keydown", function (event) {
    console.log("keydown: tagInput.value=" + tagInput.value + "; keycode=" + event.keyCode);
    chineseIMEflag = (event.keyCode == 229);//only for chrome
    // http://www.jianshu.com/p/efe1924adca9
  });
  tagBox.addEventListener("mouseover", function (event) {
    if(event.target.id.match(/^[0-9]+$/)) {
      console.log("call colorTagBoxHandle: " + event.target.id);
      colorTagBoxHandle(event.target.id);
    }
  });
  tagBox.addEventListener("mouseout", function (event) {
    if(event.target.id.match(/^[0-9]+$/)) {
      console.log("call colorRemoveTagBoxHandle: " + event.target.id);
      colorRemoveTagBoxHandle(event.target.id);
    }
  });
  tagBox.addEventListener("click", function (event) {
    if(event.target.id.match(/^[0-9]+$/)) {
      console.log("call delTagBoxHandle: " + event.target.id);
      delTagBoxHandle(event.target.id);
    }
  });
  document.getElementById("ok-btn").addEventListener("click", function () {
    okBtnHandle();
  });
}

function renderQueue() {
  var outStr = "";
  var textHTML = "";
  for (var i = 0; i < textQueue.length; i++) {
    outStr += (textQueue[i] + " ");
    textHTML += "<div id='";
    textHTML += i;
    textHTML += "' style = 'display: inline-block; margin: 10px; height: 30px; font-size: 30px; line-height: 30px; color: #ffffff; text-align:center; background-color: #ff0000'>";
    textHTML += textQueue[i];
    textHTML += "</div>";
  }
  console.log("textQueue is " + outStr);
  queueBox.innerHTML = textHTML;
  textInput.focus();
  textInput.select();
}

function renderTag() {
  var outStr = "";
  var textHTML = "";
  for (var i = 0; i < tagQueue.length; i++) {
    outStr += (tagQueue[i] + " ");
    textHTML += "<div id='";
    textHTML += i;
    textHTML += "' style = 'display: inline-block; margin: 10px; height: 30px; font-size: 30px; line-height: 30px; color: #ffffff; text-align:center; background-color: #0000ff'>";
    textHTML += tagQueue[i];
    textHTML += "</div>";
  }
  console.log("tagQueue is " + outStr);
  tagBox.innerHTML = textHTML;
  tagInput.value = "";
  tagInput.focus();
  tagInput.select();
}

/**
 * 初始化函数
 */
function init() {
  initButtonEvent();
}

init();

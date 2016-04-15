var delBoxBtn = document.getElementById("del-box-btn");
var addBoxBtn = document.getElementById("add-box-btn");
var newBoxName = document.getElementById("new-box-name");
var containerDiv = document.getElementById("container");

var containerBox = null;
var rootBox = null;

var folded = true;
var unfold = false;
var cmdShow = true;
var cmdHide = false;
//TreeBox defines the tree node data structure for build/search/render
function TreeBox(box) {
  this.parent = box.parent;
  this.childs = box.childs || [];
  this.data = box.data || "";
  this.dom = box.dom;
  this.dom.TreeBox = this;  //link
}

TreeBox.prototype = {
  constructor: TreeBox,
  render: function(folded, cmdShow) {
    if(this.childs.length == 0) {
      this.dom.getElementsByClassName("header")[0].getElementsByClassName("fold-sym")[0].innerHTML = " ";
    } else {
      this.dom.getElementsByClassName("header")[0].getElementsByClassName("fold-sym")[0].innerHTML = folded ? "+" : "-";
      for (var i = 0; i < this.childs.length; i++) {
        if(this.parent != null) {
          this.childs[i].dom.className = folded ? "box hide" : "box";
        }
      }
    }
    if(cmdShow) {
      this.dom.getElementsByClassName("header")[0].getElementsByClassName("add")[0].className = "add";
      this.dom.getElementsByClassName("header")[0].getElementsByClassName("del")[0].className = "del";
    } else {
      this.dom.getElementsByClassName("header")[0].getElementsByClassName("add")[0].className = "add hide";
      this.dom.getElementsByClassName("header")[0].getElementsByClassName("del")[0].className = "del hide";
    }
  },
  addChild: function(data) {
    if(data.trim() == "") {
      alert("节点内容为空！");
      return this;
    }
    var childBox = document.createElement("div");
    var childBoxHead = document.createElement("div");
    var childFoldSym = document.createElement("div");
    childFoldSym.innerHTML = " ";//+-
    childFoldSym.className = "fold-sym";
    childBoxHead.appendChild(childFoldSym);
    var childData = document.createElement("div");
    childData.innerHTML = data;
    childData.className = "data";
    childBoxHead.appendChild(childData);
    var childCmdAdd = document.createElement("div");
    childCmdAdd.innerHTML = "添加";
    childCmdAdd.className = "add";
    childBoxHead.appendChild(childCmdAdd);
    var childCmdDel = document.createElement("div");
    childCmdDel.innerHTML = "删除";
    childCmdDel.className = "del";
    childBoxHead.appendChild(childCmdDel);
    childBoxHead.className = "header";
    childBox.appendChild(childBoxHead);
    childBox.className = "box";
    this.dom.appendChild(childBox);
    console.log(this.dom.innerHTML);
    var newChild = new TreeBox({parent: this, childs: [], data: data, dom: childBox});
    this.childs.push(newChild);
    newChild.render(folded, cmdHide);
    this.render(unfold, cmdHide);
    return newChild;
  },
  traverse: function() {
    var boxQueue = [];
    var stackQueue = [];
    stackQueue.push(this);
    while(stackQueue.length > 0) {
      var root = stackQueue.shift();
      boxQueue.push(root);
      console.log("traverse: " + root.data);
      for (var i = 0; i < root.childs.length; i++) {
        stackQueue.push(root.childs[i]);
      } //for
    } //while
    return boxQueue;
  },
  isFold: function() {
    if(this.dom.getElementsByClassName("header")[0].getElementsByClassName("fold-sym")[0].innerHTML == "+") {
      return folded;
    } else {
      return unfold;
    }
  },
  toggleFold: function() {
    if(this.isFold() == folded) {
      this.render(unfold, cmdHide);
    } else {
      this.render(folded, cmdHide);
    }
  }
}

function initTree() {
  containerBox = new TreeBox({parent: null, childs: [], data: "container", dom: containerDiv});
  rootBox = containerBox.addChild("IC");
  rootBox.addChild("Analog");
  rootBox.childs[0].addChild("CircuitDesign");
  rootBox.childs[0].addChild("Layout");
  rootBox.addChild("Digital");
  rootBox.childs[1].addChild("FrontEnd");
  rootBox.childs[1].addChild("BackEnd");
  rootBox.childs[0].traverse();
}


var selectedBox = null;

var colorFlash = "#aaa";
var colorNormal = "#fff";
var colorClick = "#7FFFD4";

function initButtonEvent() {
  containerDiv.onclick = function(event) {
    console.log("click on: " + event.target.nodeName + " " + event.target.childNodes[0].textContent);
    var domBox = event.target;
    if(domBox.nodeName == "DIV" && domBox != containerDiv) {
      while(domBox.className != "box") {
        domBox = domBox.parentNode;
      }
      selectedBox = domBox.TreeBox;
      console.log("click on box: " + selectedBox.data);
      switch (event.target.className) {
        case "fold-sym":
          selectedBox.toggleFold();
          break;
        case "add":
          selectedBox.addChild(prompt("请输入新节点名字："));
          break;
        case "del":
          break;
        default:
      } //switch
    } //if
  } //on click
}

function init() {
  initButtonEvent();
  initTree();
}

init();

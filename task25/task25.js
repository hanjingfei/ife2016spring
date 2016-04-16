var queryBtn = document.getElementById("query-btn");
var queryText = document.getElementById("query-text");
var newBoxName = document.getElementById("new-box-name");
var containerDiv = document.getElementsByClassName("container")[0];

var containerBox = null;
var rootBox = null;
var selectedBox = null;
var matchBox = [];

var folded = true;
var unfold = false;
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
  render: function(folded) {
    if((this.dom == containerDiv) && this.isLeaf()) {
      this.dom.className = "container tip-root";
      this.dom.innerHTML = "请单击灰色区域添加根节点！";
      return;
    } else if(this.isLeaf()) {
      this.dom.getElementsByClassName("header")[0].getElementsByClassName("fold-sym")[0].innerHTML = " ";
    } else if(this.dom != containerDiv) {
      this.dom.getElementsByClassName("header")[0].getElementsByClassName("fold-sym")[0].innerHTML = folded ? "+" : "-";
      for (var i = 0; i < this.childs.length; i++) {
        if(this.parent != null) {
          this.childs[i].dom.className = folded ? "box hide" : "box";
        }
      }
    }
  },
  addChild: function(data) {
    if((data || "").trim() == "") {
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
    newChild.render(folded);
    this.render(unfold);
    return newChild;
  },
  delChild: function() {
    if(this.childs.length != 0) {
      for (var i = 0; i < this.childs.length; i++) {
        this.childs[i].delChild();
      }
    }
    this.parent.dom.removeChild(this.dom);
    for (var j = 0; j < this.parent.childs.length; j++) {
      if(this.parent.childs[j] == this) {
        this.parent.childs.splice(j,1);
        break;
      }
    }
    this.parent.render(unfold);
  },
  traverse: function(value) {
    var boxQueue = [];
    var stackQueue = [];
    stackQueue.push(this);
    while(stackQueue.length > 0) {
      var root = stackQueue.shift();
      if(root.data == value) {
        boxQueue.push(root);
      }
      console.log("traverse: " + root.data);
      for (var i = 0; i < root.childs.length; i++) {
        stackQueue.push(root.childs[i]);
      } //for
    } //while
    return boxQueue;
  },
  isLeaf: function() {
    if(this.childs.length == 0) {
      return true;
    } else {
      return false;
    }
  },
  isFold: function() {
    if(this.dom.getElementsByClassName("header")[0].getElementsByClassName("fold-sym")[0].innerHTML == "+") {
      return folded;
    } else {
      return unfold;
    }
  },
  toggleFold: function() {
    if(this.isLeaf()) {
      return;
    }
    if(this.isFold() == folded) {
      this.render(unfold);
    } else {
      this.render(folded);
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
  rootBox.traverse("");
}

function initButtonEvent() {
  containerDiv.onclick = function(event) {
    if((event.target == containerDiv) && (event.target.TreeBox.isLeaf())) {
      var str = prompt("请输入根节点名字：");
      if((str != null) && (str.trim() != "")) {
        containerDiv.innerHTML = "";
        containerDiv.className = "container";
        rootBox = containerBox.addChild(str.trim());
      }
      return;
    }
    console.log("click on: " + event.target.nodeName + " " + event.target.childNodes[0].textContent || "");
    var domBox = event.target;
    if(domBox.nodeName == "DIV" && domBox != containerDiv) {
      while(domBox.className != "box") {
        domBox = domBox.parentNode;
      }
      selectedBox = domBox.TreeBox;
      console.log("click on box: " + selectedBox.data);
      switch (event.target.className) {
        case "header":
        case "data":
        case "fold-sym":
          selectedBox.toggleFold();
          break;
        case "add":
          selectedBox.addChild(prompt("请输入新节点名字："));//cancel returns null
          break;
        case "del":
          selectedBox.delChild();
          break;
        default:
      } //switch
    } //if
  } //on click
  queryBtn.onclick = function() {
    //clear hilight
    if(matchBox) {
      for (var i = 0; i < matchBox.length; i++) {
        matchBox[i].dom.getElementsByClassName("data")[0].className = "data";
      }
    }
    var value = queryText.value.trim();
    if(value == "") {
      alert("查询内容为空！");
      return;
    } else {
      if(containerDiv.TreeBox.childs.length != 0) {
        matchBox = rootBox.traverse(value);
      } //if
      if(matchBox.length == 0) {
        alert("没找到：" + value);
        return;
      } //if
      for (var j = 0; j < matchBox.length; j++) {
        console.log(matchBox[j].data);
        matchBox[j].dom.getElementsByClassName("data")[0].className = "data hilight";
        var boxParent = matchBox[j].parent;
        while(boxParent != null) {
          boxParent.render(unfold);
          boxParent = boxParent.parent;
        }//unfold all parents of the matched child
      }
    } //if else
  } //on click
}

function init() {
  initButtonEvent();
  initTree();
}

init();

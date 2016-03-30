/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
 //aqiData is an object: city:aqi is property; city is name; aqi is value.
var aqiData = {};

function isEmpty(obj)
{
    for (var name in obj)
    {
        return false;
    }
    return true;
}
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  var city;
  var aqi;
  city = document.getElementById("aqi-city-input").value.trim();
  aqi = document.getElementById("aqi-value-input").value.trim();
  if(! city.match(/^[a-zA-z\u4E00-\u9FA5]+$/)) {
    alert("城市名称必须为中英文字符。" + city +" 中包含非中英文字符。");
    document.getElementById("aqi-city-input").focus();
    document.getElementById("aqi-city-input").select();
    return;
  }
  if(! aqi.match(/^[0-9]+$/)) {
    alert("空气质量指数必须为整数数字。" + aqi + " 中包含非数字字符或小数点。");
    document.getElementById("aqi-value-input").focus();
    document.getElementById("aqi-value-input").select();
    return;
  }
  aqiData[city] = aqi;
  document.getElementById("aqi-city-input").value = "";
  document.getElementById("aqi-value-input").value = "";
  document.getElementById("aqi-city-input").focus();
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  //inital value for table header
  if(! isEmpty(aqiData)) {
    document.getElementById("aqi-table").innerHTML =
      ("<tr><th>" + "城市" + "</th><th>" + "空气质量" + "</th><th>" + "操作" + "</th></tr>");
    for (var city in aqiData) {
      document.getElementById("aqi-table").innerHTML +=
        ("<tr><td>" + city + "</td><td>" + aqiData[city] + "</td><td><button id ='" + city + "'>删除</button></td></tr>");
    }
  } else {
    document.getElementById("aqi-table").innerHTML = "";
  }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(city) {
  // do sth.
  delete aqiData[city];
  renderAqiList();
  document.getElementById("aqi-city-input").value = "";
  document.getElementById("aqi-value-input").value = "";
  document.getElementById("aqi-city-input").focus();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById("add-btn").addEventListener("click", function () {
    console.log("click on: " +  event.target.nodeName);
    console.log("call addBtnHandle");
    addBtnHandle();
  });

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  document.getElementById("aqi-table").addEventListener("click", function (event) {
    console.log("click on: " +  event.target.nodeName);
    if(event.target.nodeName == "BUTTON") {
      console.log("call delBtnHandle with id=" + event.target.id);
      delBtnHandle(event.target.id);
    }
  });
}

init();

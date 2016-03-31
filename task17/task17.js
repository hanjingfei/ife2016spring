/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    //returnData[datStr] = 100;
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

function graTime2Hanzi(value) {
  return (value == "day") ? "日": (value == "week") ? "周" : (value == "month") ? "月" : "日";
}

function index2Hanzi(graTime, value) {
  var returnDate;
  if(graTime == "week") {
    returnDate = "第" + value + "周周平均";
  } else if (graTime == "month") {
    returnDate = value + "月月平均";
  } else {
    returnDate = value;
  }
  return returnDate;
}

function calUnitWidth(totalWidth, unitNum) {
  var unitWidth = Math.floor(totalWidth/unitNum);
  return unitWidth;
}

//phrase 2016-03-31 and return 1 if the day is Sunday
//       0123456789
function isWeekEnd(textDate) {
  var d = new Date();
  if((textDate.length != 10) || (textDate.substr(4,1) != "-") || (textDate.substr(7,1) != "-")) {
    console.log("Error date format: " + textDate);
    return 0;
  }
  var year = textDate.substr(0,4);
  var month = textDate.substr(5,2);
  var day = textDate.substr(8,2);
  d.setFullYear(year,month-1,day);
  if(d.getDay() == 0) {
    return 1;
  } else {
    return 0;
  }
}

//phrase 2016-03-31 and return 1 if the tomrrow day is 1st.
//       0123456789
function isMonthEnd(textDate) {
  var d = new Date();
  if((textDate.length != 10) || (textDate.substr(4,1) != "-") || (textDate.substr(7,1) != "-")) {
    console.log("Error date format: " + textDate);
    return 0;
  }
  var year = textDate.substr(0,4);
  var month = textDate.substr(5,2);
  var day = textDate.substr(8,2);
  d.setFullYear(year,month-1,day);
  d.setDate(d.getDate() + 1);//set to tomrrow
  if(d.getDate() == 1) {
    return 1;
  } else {
    return 0;
  }
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};
var unitNum = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: 0,
  nowGraTime: "day"
}

var citySelector = document.getElementById("city-select");
var graTimeForm = document.getElementById("form-gra-time");
var aqiChartWrap = document.getElementById("aqi-chart-wrap");
/**
 * 渲染图表
 */
function renderChart() {
  console.log("nowSelectCity=" + pageState.nowSelectCity + "\nnowGraTime=" + pageState.nowGraTime);
  var posLeft = 0;
  var totalWidth = graTimeForm.clientWidth - 100;
  var tmpNum = 0;
  var textHTML = "";
  var textCity = citySelector.options[pageState.nowSelectCity].text
  var unitWidth = calUnitWidth(totalWidth, unitNum[pageState.nowGraTime][textCity]);
  console.log("unitWidth=" + unitWidth + "\ntotalWidth= " + totalWidth + "\nunitNum=" + unitNum);
  var cityChartData = {};
  cityChartData = chartData[pageState.nowGraTime][textCity];

  console.log("renderChart: ");
  console.log("renderChart Width: " + aqiChartWrap.clientWidth);
  textHTML += "<fieldset> <legend>";
  textHTML += textCity;
  textHTML += "1-3月空气质量柱状图(";
  textHTML += graTime2Hanzi(pageState.nowGraTime);
  textHTML += "平均)</legend><div style = 'position: relative; width: ";
  textHTML += totalWidth;
  textHTML += "px; height: 520px; background-color: #eee; margin: 30px;'>";
  for (var index in cityChartData) {
    textHTML += "<div style = 'position: absolute; width: ";
    textHTML += unitWidth;
    textHTML += "px; height: "
    textHTML += cityChartData[index];
    //console.log(cityChartData[index] + " @ " + index);
    textHTML += "; bottom: 0px; left: ";
    textHTML += posLeft;
    textHTML += "px; background-color: #888;' title = \""
    textHTML += (textCity + index2Hanzi(pageState.nowGraTime, index) + "空气质量： " + cityChartData[index]);
    textHTML += "\"></div>";
    posLeft += unitWidth;
    tmpNum++;
  }
  textHTML += "</div></fieldset>";
  console.log("tmpNum= " + tmpNum);
  aqiChartWrap.innerHTML = textHTML;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(value) {
  console.log("curTimer: " + value);
  // 确定是否选项发生了变化
  if(value == pageState.nowGraTime) {
    console.log("graTime No Change: " + value);
  } else {
    pageState.nowGraTime = value;
    // 调用图表渲染函数
    renderChart();
  }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(value) {
  console.log("curCity: " + citySelector.options[value].text);
  // 确定是否选项发生了变化
  if(value == pageState.nowSelectCity) {
    console.log("city No Change: " + citySelector.options[value].text);
  } else {
    pageState.nowSelectCity = value;
    // 设置对应数据

    // 调用图表渲染函数
    renderChart();
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  graTimeForm.addEventListener("click", function () {
    console.log("click: " +  event.target.nodeName);
    graTimeChange(event.target.value);
  });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var i = 0;
  citySelector.options.length = 0; //clear old selector
  for (var city in aqiSourceData) {
    console.log("city: "+ city);
    citySelector.options.length = i + 1;
    citySelector.options[i].text = city;
    i++;
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelector.addEventListener("change", function () {
    console.log("change: " +  event.target.nodeName);
    citySelectChange(event.target.selectedIndex);
  });
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  var d = new Date();
  var numDay = 0;
  var numWeek = 0;
  var numWeekDay = 0;
  var numMonth = 0;
  var numMonthDay = 0;
  var aqiSourceDataWeek = {};
  var aqiSourceDataMonth = {};
  var sumWeek;
  var sumMonth;
  unitNum["day"] = {};
  unitNum["week"] = {};
  unitNum["month"] = {};
  // 将原始的源数据处理成图表需要的数据格式
  for (var city in aqiSourceData) {
    numDay = 0;
    numWeek = 0;
    numMonth = 0;
    sumWeek = 0;
    sumMonth = 0;
    aqiSourceDataWeek[city] = {};
    aqiSourceDataMonth[city] = {};
    for (var date in aqiSourceData[city]) {
      numDay++;
      //cal by week
      sumWeek += aqiSourceData[city][date];
      numWeekDay++;
      if(isWeekEnd(date) && (numWeekDay > 0)) {
        numWeek++;
        aqiSourceDataWeek[city][numWeek] = Math.round(sumWeek/numWeekDay);
        sumWeek = 0;
        numWeekDay = 0;
      }
      //cal by month
      sumMonth += aqiSourceData[city][date];
      numMonthDay++;
      if(isMonthEnd(date) && (numMonthDay > 0)) {
        numMonth++;
        aqiSourceDataMonth[city][numMonth] = Math.round(sumMonth/numMonthDay);
        sumMonth = 0;
        numMonthDay = 0;
      }
    }
    //remain days for an incomplete week
    if(numWeekDay > 0) {
      numWeek++;
      aqiSourceDataWeek[city][numWeek] = Math.round(sumWeek/numWeekDay);
      sumWeek = 0;
      numWeekDay = 0;
    }
    if(numMonthDay > 0) {
      numMonth++;
      aqiSourceDataMonth[city][numMonth] = Math.round(sumMonth/numMonthDay);
      sumMonth = 0;
      numMonthDay = 0;
    }
    unitNum["day"][city] = numDay;
    unitNum["week"][city] = numWeek;
    unitNum["month"][city] = numMonth;
    console.log(city + " has " + unitNum["day"][city] + "days");
    console.log(city + " has " + unitNum["week"][city] + "weeks");
    console.log(city + " has " + unitNum["month"][city] + "months");
}
  // 处理好的数据存到 chartData 中
  chartData["day"] = aqiSourceData;
  chartData["week"] = aqiSourceDataWeek;
  chartData["month"] = aqiSourceDataMonth;
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

init();

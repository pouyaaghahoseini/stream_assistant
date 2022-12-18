const imgPath = '../img/'
var showgraph = true;
var results = []
var graphLabel = ['Yes', 'No', 'Maybe', 'IDK'];
var graphData = [50, 30, 10, 10];
var graphBgColor = ['rgba(56, 151, 210,0.3)'];
var graphBorder = ['rgba(3,11,16,1)'];
var startTime = 50;
var stopTime = 100;
var updateSpeed = 5000;
const slider = document.getElementById("slider-distance");
// // slider.innerHTML = ``;
var btn1min = document.getElementById('button-1min');
var btn5min = document.getElementById('button-5min');
var btn10min = document.getElementById('button-10min');
var btn15min = document.getElementById('button-15min');

var pollOption = document.getElementById('poll-option');
const addBTN = document.getElementById("button-add");
const resetBTN = document.getElementById("button-reset");

pollOption.addEventListener("keypress", function(event){
  if (event.key === "Enter"){
    event.preventDefault();
    addBTN.click();
  }
});

addBTN.onclick = function(){
  console.log("addBTN has been pressed.")
  if(pollOption.value != ""){
    $.post("/addOption",
    {
    input: String(pollOption.value),
    });
  }
  console.log("Input value is " + pollOption.value);
  pollOption.value="";
  generatePoll();
};

resetBTN.onclick = function(){
  console.log("resetBTN has been pressed.")
    $.post("/resetOptions",{});
    generatePoll();
};

var speedRangeSlider = document.getElementById('speed-range');
var changespeedValue = function(){
  var newValue = speedRangeSlider.value;
  var target = document.getElementById('speed-value');
  target.innerHTML = newValue + "s";
}
var sendSpeedChange = function(){
  var newValue = speedRangeSlider.value;
  updateSpeed = newValue *1000;
  console.log("Speed changed to", updateSpeed);
  $.post("/speedUpdate",
  {
    speed: String(newValue)
   });
}
speedRangeSlider.addEventListener("input", changespeedValue);
speedRangeSlider.addEventListener("change", sendSpeedChange);



var changeRange = function(){
  console.log("changeRange called");
  $.post("/rangeUpdate",
  {
    start: String(document.getElementById("range1").value),
    stop: String(document.getElementById("range2").value), 
   });
}
document.getElementById("range1").addEventListener("change", changeRange);
document.getElementById("range2").addEventListener("change", changeRange);








updateSlider();


function updateSlider(){
  document.getElementById('slider-inverse-left').style.width = document.getElementById('slider-inverse-left').style.width;
  document.getElementById('slider-range').style.left = document.getElementById('slider-range').style.left;
  document.getElementById('slider-thumb-start').style.left = document.getElementById('slider-thumb-start').style.left;
  document.getElementById('slider-sign-start').style.left = document.getElementById('slider-sign-start').style.left;
  document.getElementById('slider-sign-span-start').innerHTML = document.getElementById('slider-sign-span-start').innerHTML;


  document.getElementById('slider-inverse-right').style.width = document.getElementById('slider-inverse-right').style.width;
  document.getElementById('slider-range').style.right = document.getElementById('slider-range').style.right;
  document.getElementById('slider-thumb-stop').style.left = document.getElementById('slider-thumb-stop').style.left;
  document.getElementById('slider-sign-stop').style.left = document.getElementById('slider-sign-stop').style.left;
  document.getElementById('slider-sign-span-stop').innerHTML = document.getElementById('slider-sign-span-stop').innerHTML;
}



// Graph data variables

// data for graph, allows us to change it easier


var data = {
  labels: graphLabel,
  datasets: [
    {
      label: 'Word Frequency', 
      data: graphData,
      backgroundColor: graphBgColor,
      borderColor: graphBorder,
      borderWidth: 3,
    },
  ],
};

// config
var config = {
  type: 'bar',
  data,
  options: {
    plugins:{
      legend: {
        display: true
      }
    },
    maintainAspectRatio: false,
    scales: {
      y: {
          ticks: {
              // Include a dollar sign in the ticks
              callback: function(value, index, ticks) {
                  return '$' + value;
              }
          }
      }
    }
  },
};


function generatePoll(){
  clearInterval(pollInterval);
  console.log("Runninh GENERATE POLL FUNCTION")
  graphLabel = [];
  graphData = [];
  graphBgColor = [];
  sum = 0.0;
  for(i=0; i<results.length; i++){
    graphLabel.push(results[i].term);
    if (results[i].type == "Option")
      graphBgColor.push('rgba(66, 108, 245, 0.3)');
    else
      graphBgColor.push('rgba(56, 151, 210,0.3)');

    sum += results[i].freq
  }
  for(i=0; i<results.length; i++){
    // graphData.push(results[i].freq/sum * 100);
    graphData.push(results[i].freq);
  }
  data = {
    labels: graphLabel,
    datasets: [
      {
        label: 'Word Frequency',
        data: graphData,
        backgroundColor: graphBgColor,
        borderColor: graphBorder,
        borderWidth: 3,
      },
    ],
  };
  
  config = {
    type: 'bar',
    data,
    options: {
      plugins:{
        legend: {
          display: true
        }
      },
      maintainAspectRatio: false,
    },
  };

  chart.destroy(); // need this to delete the chart to create new one
  chart = new Chart(document.getElementById('canvas'), config);
  chart.update();
  
  pollInterval = setInterval(async() =>{
    generatePoll();
  }, updateSpeed);
  
}

// display graph
let chart = new Chart(document.getElementById('canvas'), config);

var pollEventSource = new EventSource('//hornbill.cs.umanitoba.ca/polling');
pollEventSource.onopen = function(e) {
  console.log("Poll Event: open");
};

pollEventSource.onerror = function(e) {
  console.log("Poll Event: error");
  if (this.readyState == EventSource.CONNECTING) {
    // console.log(`Reconnecting (readyState=${this.readyState})...`);
  } else {
    // console.log("Error has occured.");
  }
};

pollEventSource.onmessage = function(e) {
  console.log("Event: poll, data: " + e.data);
  results = JSON.parse(e.data);
};

pollInterval = setInterval(async() =>{
  generatePoll();
}, updateSpeed);



//////-----------------
btn1min.addEventListener('click', function () {
  var range1 = document.getElementById("range1"); 
  range1.value=-1;
  var value=(100/(parseInt(range1.max)-parseInt(range1.min)))*parseInt(range1.value)-(100/(parseInt(range1.max)-parseInt(range1.min)))*parseInt(range1.min);
  var children = range1.parentNode.childNodes[1].childNodes;
  children[1].style.width=value+'%';
  children[5].style.left=value+'%';
  children[7].style.left=value+'%';
  children[11].style.left=value+'%';
  children[11].childNodes[1].innerHTML=range1.value;

  var range2 = document.getElementById("range2"); 
  range2.value = 0;

  range2.value=Math.max(range2.value,range2.parentNode.childNodes[3].value-(-1));
  var value=(100/(parseInt(range2.max)-parseInt(range2.min)))*parseInt(range2.value)-(100/(parseInt(range2.max)-parseInt(range2.min)))*parseInt(range2.min);
  var children = range2.parentNode.childNodes[1].childNodes;
  children[3].style.width=(100-value)+'%';
  children[5].style.right=(100-value)+'%';
  children[9].style.left=value+'%';
  children[13].style.left=value+'%';
  children[13].childNodes[1].innerHTML=range2.value;

  $.post("/rangeUpdate",
  {
    start: String(document.getElementById("range1").value),
    stop: String(document.getElementById("range2").value), 
   });
});

btn5min.addEventListener('click', function () {
  var range1 = document.getElementById("range1"); 
  range1.value=-5;
  var value=(100/(parseInt(range1.max)-parseInt(range1.min)))*parseInt(range1.value)-(100/(parseInt(range1.max)-parseInt(range1.min)))*parseInt(range1.min);
  var children = range1.parentNode.childNodes[1].childNodes;
  children[1].style.width=value+'%';
  children[5].style.left=value+'%';
  children[7].style.left=value+'%';
  children[11].style.left=value+'%';
  children[11].childNodes[1].innerHTML=range1.value;

  var range2 = document.getElementById("range2"); 
  range2.value = 0;

  range2.value=Math.max(range2.value,range2.parentNode.childNodes[3].value-(-1));
  var value=(100/(parseInt(range2.max)-parseInt(range2.min)))*parseInt(range2.value)-(100/(parseInt(range2.max)-parseInt(range2.min)))*parseInt(range2.min);
  var children = range2.parentNode.childNodes[1].childNodes;
  children[3].style.width=(100-value)+'%';
  children[5].style.right=(100-value)+'%';
  children[9].style.left=value+'%';
  children[13].style.left=value+'%';
  children[13].childNodes[1].innerHTML=range2.value;

  $.post("/rangeUpdate",
  {
    start: String(document.getElementById("range1").value),
    stop: String(document.getElementById("range2").value), 
   });
});

btn10min.addEventListener('click', function () {
  var range1 = document.getElementById("range1"); 
  range1.value=-10;
  var value=(100/(parseInt(range1.max)-parseInt(range1.min)))*parseInt(range1.value)-(100/(parseInt(range1.max)-parseInt(range1.min)))*parseInt(range1.min);
  var children = range1.parentNode.childNodes[1].childNodes;
  children[1].style.width=value+'%';
  children[5].style.left=value+'%';
  children[7].style.left=value+'%';
  children[11].style.left=value+'%';
  children[11].childNodes[1].innerHTML=range1.value;

  var range2 = document.getElementById("range2"); 
  range2.value = 0;

  range2.value=Math.max(range2.value,range2.parentNode.childNodes[3].value-(-1));
  var value=(100/(parseInt(range2.max)-parseInt(range2.min)))*parseInt(range2.value)-(100/(parseInt(range2.max)-parseInt(range2.min)))*parseInt(range2.min);
  var children = range2.parentNode.childNodes[1].childNodes;
  children[3].style.width=(100-value)+'%';
  children[5].style.right=(100-value)+'%';
  children[9].style.left=value+'%';
  children[13].style.left=value+'%';
  children[13].childNodes[1].innerHTML=range2.value;

  $.post("/rangeUpdate",
  {
    start: String(document.getElementById("range1").value),
    stop: String(document.getElementById("range2").value), 
   });
});

btn15min.addEventListener('click', function () {
  var range1 = document.getElementById("range1"); 
  range1.value=-15;
  var value=(100/(parseInt(range1.max)-parseInt(range1.min)))*parseInt(range1.value)-(100/(parseInt(range1.max)-parseInt(range1.min)))*parseInt(range1.min);
  var children = range1.parentNode.childNodes[1].childNodes;
  children[1].style.width=value+'%';
  children[5].style.left=value+'%';
  children[7].style.left=value+'%';
  children[11].style.left=value+'%';
  children[11].childNodes[1].innerHTML=range1.value;

  var range2 = document.getElementById("range2"); 
  range2.value = 0;

  range2.value=Math.max(range2.value,range2.parentNode.childNodes[3].value-(-1));
  var value=(100/(parseInt(range2.max)-parseInt(range2.min)))*parseInt(range2.value)-(100/(parseInt(range2.max)-parseInt(range2.min)))*parseInt(range2.min);
  var children = range2.parentNode.childNodes[1].childNodes;
  children[3].style.width=(100-value)+'%';
  children[5].style.right=(100-value)+'%';
  children[9].style.left=value+'%';
  children[13].style.left=value+'%';
  children[13].childNodes[1].innerHTML=range2.value;

  $.post("/rangeUpdate",
  {
    start: String(document.getElementById("range1").value),
    stop: String(document.getElementById("range2").value), 
   });
});

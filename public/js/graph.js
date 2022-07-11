/* first graph*/

var graph = true;
var barBtn = document.getElementById('bar-graph');
var pieBtn = document.getElementById('pie-graph');
var btn = document.getElementById('start');
// buttons

barBtn.addEventListener('click', function () {
  graph = true;
  changeChart(graph);
});

pieBtn.addEventListener('click', function () {
  graph = false;
  changeChart(graph);
});

btn.addEventListener('click', function () {
  document.querySelector('.one').innerHTML = '1. hello';
});

// Graph data variables

const data = {
  labels: ['Yes', 'No'],
  datasets: [
    {
      label: 'Chat Polling',
      data: [70, 30],
      backgroundColor: 'rgba(108, 74, 126, 0.3)',
      borderColor: 'rgba(108, 74, 126)',
      borderWidth: 3,
    },
  ],
};

// config
const config = {
  type: 'bar',
  data,
  options: {
    maintainAspectRatio: false,
  },
};

// display graph
let myChart = new Chart(document.getElementById('canvas'), config);

function changeChart(type) {
  myChart.destroy();

  myChart = new Chart(document.getElementById('canvas'), config);

  if (type) {
    // myChart = new Chart(document.getElementById('canvas'), config);
    myChart.config.type = 'bar';
  } 
  else if (!type) {
    // myChart.config.data.datasets.data = [50,50];
    // myChart = new Chart(document.getElementById('canvas'), config);
    myChart.config.type = 'pie';
  }
  myChart.update();
}
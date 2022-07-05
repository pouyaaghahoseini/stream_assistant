/* first graph*/

var graph = true;

var barBtn = document.getElementById('bar-graph');
var pieBtn = document.getElementById('pie-graph');

barBtn.addEventListener('click', function () {
  graph = true;
});

pieBtn.addEventListener('click', function () {
  graph = false;
});

const ctx = document.getElementById('canvas').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
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
  },
  options: {
    // responesive: false,
    maintainAspectRatio: false,
  },
});

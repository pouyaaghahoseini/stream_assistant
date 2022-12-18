const wordbox = document.querySelector('.word-box');
var wordlist = [];
async function getCloud (w) {
  console.log("W is:", w);
  var wcloud = [];
  var s=70;
  sumFreq = 0;
  console.log(w.length)
  for (i=0; i<w.length; i++){
    // console.log("Print:", w[i].text, ":", w[i].frequency);
    sumFreq += w[i].frequency;
    if(i> 15)
      s=20;
    else if(i>10)
      s=30;
    else if(i>6)
      s=40;
    else if (i>3)
      s=50
    else if (i>1)
      s=60;
    else
      s=70;
    wcloud.push({text: w[i].text, size: s})
  }
  console.log("Sum is:", sumFreq);
  console.log("sliced is", w.slice(0,20));
  const cloud = w.slice(0,20).map(function(d, index) {
  return {text: d.text, size: (20-index)*2.5 +20  , test: "haha"};
  })
  console.log("This is cloud", cloud);
  return cloud;
}


async function generateWordCloud(){
  clearInterval(wordInterval);
  const cloud = await getCloud(wordlist);

  // const highestScore = Math.max(...cloud.map((x) => x.size));

  var layout = d3.layout.cloud()
  .size([wordbox.offsetWidth, wordbox.offsetHeight])
  .words(cloud)
  .padding(5)
  .spiral("archimedean")
  .rotate(function() { return ~~(Math.random() * 10) -5 ; })
  .font("Impact")
  .fontSize(function(d) { return d.size; })
  .on("end", draw);

  layout.start();

  function fillcolor(){
    colors = ["#3eb0d5", "#b2399e", "#c2dd67", "#592ec2", "#4176be", "#71d16d", "#ffd95f", "#b32f38", "#e57947", "#fcb555", "#71d16d", "#2b99f7", "#170658", "#a3a3ff", "#27700e", "#7277E0", "#55ED9E", "#C8ED5C", "#ED7013", "#241882", "#00EEEE", "#8B2323", "#5C3317", "#8B4513", "#228B22", "#EE7600", "#8B7D6B", "#FFA500", "#236B8E", "#846AEB", "#97EDE1", "#C2DE68", "#F5B067", "#EB63D7", "#EB3662", "#008DEB", "#E0759B", "#FA5050"];
    return colors[Math.floor(Math.random()*colors.length)];
  }
  
  function draw(words) {
    wordbox.innerHTML = ``; 
    d3.select(wordbox).append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", fillcolor)
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }
  wordInterval = setInterval(async() =>{
    generateWordCloud();
  }, updateSpeed);
}


// SERVER SENT EVENTS ->
var wordEventSource = new EventSource('//hornbill.cs.umanitoba.ca/words');
wordEventSource.onopen = function(e) {
  // console.log("Word Event: open");
};

wordEventSource.onerror = function(e) {
  // console.log("Word Event: error");
  if (this.readyState == EventSource.CONNECTING) {
    // console.log(`Reconnecting (readyState=${this.readyState})...`);
  } else {
    // console.log("Error has occured.");
  }
};

wordEventSource.onmessage = function(e) {
  // console.log("Word Event: word, data: " + e.data);
  var temp = JSON.parse(e.data);
  wordlist = temp;
  // console.log("New wordlist received!");
  // generateWordCloud(wordlist);
};
// <- SERVER SENT EVENTS ----

wordInterval = setInterval(async() =>{
  generateWordCloud();
}, updateSpeed);



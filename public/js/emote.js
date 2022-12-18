const gallery = document.querySelector('.gallery');
var emotes, n;
function generateEmote(link, freq){
    return`
        <div class="item h${freq} v${freq}">
            <img src="${link}">
        </div>
    `;
}
function generateTopEmotes(){
    clearInterval(emoteInterval);
    console.log("OK RUNNING", n);
    var html = '';
    for (i=0; i<n; i++){
        link = emotes[i].link;
        freq = emotes[i].frequency;
        if(i < 2){
            html = html.concat(generateEmote(link, 3));
        }
        else if(i < 5){
            html = html.concat(generateEmote(link, 2));
        }
        else{       
            html = html.concat(generateEmote(link, 1));
        }
        }
    console.log('result: ',html);
    gallery.innerHTML = html;
    emoteInterval = setInterval(async() =>{
      generateTopEmotes();
    }, updateSpeed);
}


var eventSource = new EventSource('//hornbill.cs.umanitoba.ca/emotes');
eventSource.onopen = function(e) {
  // console.log("Event: open");
};

eventSource.onerror = function(e) {
  console.log("Event: error");
  if (this.readyState == EventSource.CONNECTING) {
    // console.log(`Reconnecting (readyState=${this.readyState})...`);
  } else {
    // console.log("Error has occured.");
  }
};

eventSource.onmessage = function(e) {
  // console.log("Event: emote, data: " + e.data);
  var temp = JSON.parse(e.data);
  emotes = temp;
  n = temp.length;
  // generateTopEmotes(temp, temp.length);
};


emoteInterval = setInterval(async() =>{
  generateTopEmotes();
}, updateSpeed);

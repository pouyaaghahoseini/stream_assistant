var express = require('express');
var chatprocessing = new express.Router();
const emoteParser = require("tmi-emote-parse");
const tmi = require('tmi.js');
const twitchemoteparser = require("twitch-emote-parser");
const mysql = require('mysql');
var sliderStart = -60, sliderEnd = 0;
var pollOptions = [];
var updateSpeed = 5;

const users = mysql.createConnection({
  user:'root',
  host:'localhost',
  password:'123456',
  database: 'mockUsers'
});
users.connect(function(err) {
  if (err) throw err;
  console.log("Users Database Connected!");
});

const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'123456',
    database: 'CHAT'
})
db.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});

let emoteid = 0;
let chatid = 0;
var chnl;
// Prototype Route directs to login page
chatprocessing.get('/prototype', (req, res) => {
  res.render('login', { text: 'Hey' })
  clearMessages(db);
  clearWords(db);
  clearEmotes(db);
  clearOptions(db);
  })
  // Prototype index page
  chatprocessing.get('/index', (req, res) => {
    res.render('index', { name: "example" })
   })
   // Login Page sends the channel name to prototype index page 
  chatprocessing.post('/login', (req, res) =>{
    console.log(req.body.chname, req.body.passwd);
    users.query('SELECT * FROM Channels WHERE channel = ? AND password = ? UNION SELECT * FROM Channels WHERE password = 123456', [req.body.chname, req.body.passwd], function(error, results, fields) {
      // If there is an issue with the query, output the error
      if (error) throw error;
      // If the account exists
      if (results.length > 0) {
        // Authenticate the user
        renderPrototype(req.body.chname, res);
        // response.redirect('/home');
      } else {
        res.status(404).send({success: false, error: {message: 'No blah Found'}});
      }
      });
  });
  // chatprocessing.get('/login',(req, res)=>{
  //   createRandomNamedEvents(req, res);
  // });
// code for redis

// code for twitch chat


// Just prints to CONSOLE not web console
async function onConnectedHandler (address, port) {
    streamStartTime = Date.now();
    console.log(`* Server js Connected to ${address}:${port}`);
    try {
    emoteParser.loadAssets(chnl, { "bttv": false, "ffz": false, "7tv": false });
    }
    catch (err){
      console.log("tmi-emote-parse Error:", err);
    }
}

  /*
  Target = channel name
  Context = meta-information about the user and the sent message
  Message = actual message sent in the chat
  */
async function onMessageHandler (target, context, message, self) {

    username = context['display-name']; // username
    timesent = context['tmi-sent-ts']; // Timestamp of the message
    user_id =  context['user-id']; // Timestamp of the message

    emotelist =  emoteParser.getEmotes(message,context,chnl,self);
    for(i=0; i<emotelist.length; i++){
      key = "emote:"+emoteid;
      // console.log("EMOTE:", emotelist);
      // console.log(key, "Link", emotelist[i].img, "Time", Date.now());
      // console.log("CONTEXT:", context);
      var add_emote = "INSERT INTO Emotes (link, ts, name) VALUES (?, ?, ?)";
      db.query(add_emote, [emotelist[i].img, timesent, emotelist[i].code], function (err, result) {
        if (err) console.log('message was invalid.')
        // throw err;
        console.log("1 emote inserted");
      });
      emoteid++;
    }
    if(!message.includes("http") && !message.includes("//") && !message.includes("www") && !message.includes(".tv") && !message.includes(".com")){

      var add_message = "INSERT INTO Messages (username, message, ts, user_id) VALUES (?, ?, ?, ?)";
      db.query(add_message, [username, message, timesent, user_id], function (err, result) {
        if (err) console.log('message was invalid.')
        // throw err;
        console.log("1 message inserted");
      });


      var add_word = "INSERT INTO Words (username, word, ts, user_id) VALUES (?, ?, ?, ?)";
      var messageParsed = message.replace(/[\[\]/.,"#$%&\*;:{}=_`~()]/g,"").toLowerCase();
      console.log(messageParsed,"------------------------------------------------");
      const wordsArray = messageParsed.trim().split(/\s+/);
      console.log(wordsArray);
      for(w of wordsArray){
        if(pollOptions.includes(w)){
          db.query(add_word, [username, w, timesent, user_id], function (err, result) {
            if (err) console.log('word was invalid.')
            // throw err;
            // console.log ("second case inserted");
          });
        }

        else if ( !(w.endsWith("!")) && !(w.endsWith("?")) && !(w.startsWith("!")) ){
          db.query(add_word, [username, w, timesent, user_id], function (err, result) {
            if (err) console.log('word was invalid.')
            // throw err;
            // console.log ("first case inserted");
          });
          if (w.includes("'")){
            var temp = w.replace(/[\']/g,"");
            console.log("Temp: ", temp);
            db.query(add_word, [username, temp, timesent, user_id], function (err, result) {
              if (err) console.log('word was invalid.')
              // throw err;
              // console.log ("second case inserted");
            });
          }
        }
        else if ( w.endsWith("!") || w.endsWith("?")){
          var temp = w.replace(/[!\?]/g,"");
          console.log("Temp: ", temp);
          db.query(add_word, [username, temp, timesent, user_id], function (err, result) {
            if (err) console.log('word was invalid.')
            // throw err;
            console.log ("third case inserted");
          });
        }
      }
    }

}

////////////// EMOTE SENDING SECTION

async function sendEmotes(req, res){
  res.writeHead(200, {
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  let start = Date.now() + sliderStart * 60000;
  let end = Date.now() + sliderEnd * 86400000;
  let emoteTimer = setInterval(sendEmotes, updateSpeed*10000);

  // console.log('emoteid is:', emoteid);
  emoteQuery = "Select link,  COUNT(*) AS frequency FROM (Select * From Emotes Order BY ts DESC) AS TIMED WHERE ts > ? and ts < ? and link IS NOT NULL GROUP BY link ORDER BY COUNT(*) DESC LIMIT 10";
  // emoteQuery = "Select link,  COUNT(*) AS frequency FROM Emotes WHERE link IS NOT NULL GROUP BY link ORDER BY COUNT(*) DESC LIMIT 15";
  // emoteQuery = "Select link,  COUNT(*) AS frequency FROM Emotes WHERE ts > ? and ts < ? GROUP BY link ORDER BY COUNT(*) DESC";
  db.query(emoteQuery, [start, end], function (err, result, fields) {
    if (err) throw err;
    var data = Object.values(JSON.parse(JSON.stringify(result)));
    sendData(data);
  });

  function sendData(data) {
  const dataToSend = JSON.stringify(data);
  // console.log(dataToSend, "length", dataToSend.length, "type", typeof(dataToSend));
  res.write(`retry:` + updateSpeed + `000\n`);
  res.write(`data:${dataToSend}`);
  res.write("\n\n");
  clearInterval(emoteTimer);
  res.end();
  }
  return;
}

chatprocessing.get('/emotes', (req, res)=>{
  sendEmotes(req,res);
});

////////////// WORD SENDING SECTION

async function sendWords(req, res){
  res.writeHead(200, {
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  let start = Date.now() + sliderStart * 60000;
  let end = Date.now() + sliderEnd * 86400000;
  let wordTimer = setInterval(sendWords, updateSpeed*10000);
  // messageQuery = "Select username, message FROM Messages WHERE ts > ? and ts < ?";
  // db.query(messageQuery, [start, end], function (err, result, fields) {
  //   if (err) throw err;
  //   var data = Object.values(JSON.parse(JSON.stringify(result)));
  //   // console.log("This is data:", data);
  //   sendtheWords(data);
  // });
  // wordQuery = "Select word as text, COUNT(*) AS frequency FROM Words WHERE word NOT IN(SELECT Word From Parsing)  and word NOT IN(SELECT username From Messages) and word NOT REGEXP '^[@!]' GROUP BY word ORDER BY COUNT(*) DESC LIMIT 20";
  wordQuery = "Select word as text, COUNT(*) AS frequency FROM Words WHERE word IS NOT NULL and ts > ? and ts < ? and word NOT IN(SELECT DISTINCT Name From Emotes WHERE Name IS NOT NULL) and word NOT IN(SELECT DISTINCT Word From Parsing) and word NOT IN(SELECT DISTINCT username From Messages WHERE username IS NOT NULL) and word NOT REGEXP '^[@!]' GROUP BY word ORDER BY COUNT(*) DESC LIMIT 20";
  // wordQuery = "Select word as text, COUNT(*) AS frequency FROM Words WHERE word NOT IN(SELECT Word From Parsing) and word NOT LIKE '@%' and ts > ? and ts < ? GROUP BY word ORDER BY COUNT(*) DESC";
  db.query(wordQuery, [start, end], function (err, result, fields) {
    if (err) throw err;
    var data = Object.values(JSON.parse(JSON.stringify(result)));
    // console.log("This is data:", data);
    sendtheWords(data);
  });

  function sendtheWords(data) {
  const dataToSend = JSON.stringify(data);
  console.log("this is words", dataToSend);
  res.write(`retry:`+updateSpeed+`000\n`);
  res.write(`data:${dataToSend}`);
  res.write("\n\n");
  clearInterval(wordTimer);
  res.end();
  }
  return;
}

chatprocessing.get('/words', (req, res)=>{
  console.log("Word Cloud Request Recieved.");
  sendWords(req,res);
});

///////////// POLL SENDING SECTION

async function sendPoll(req, res){
  res.writeHead(200, {
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  let start = Date.now() + sliderStart * 60000;
  let end = Date.now() + sliderEnd * 86400000;
  let pollTimer = setInterval(sendPoll, updateSpeed*10000);
  pollQuery = "(Select 'Option' as type, word as term, COUNT(*) AS freq FROM Words WHERE ts > ? and ts < ? and word IS NOT NULL and word IN (Select word from Options) GROUP BY term ORDER BY COUNT(*) DESC)" +
   " UNION (Select 'Query' as type, word as term, COUNT(*) AS freq FROM Words WHERE ts > ? and ts < ? and word IS NOT NULL and word NOT IN(SELECT Word From Parsing) and word NOT IN(SELECT Distinct Name From Emotes Where Name IS NOT NULL) and word NOT IN(SELECT DISTINCT username From Messages WHERE username IS NOT NULL) and word NOT IN (Select word from Options) and word NOT REGEXP '^[@!]' GROUP BY term ORDER BY COUNT(*) DESC LIMIT 4)" +
   "LIMIT 6";
  // pollQuery = "Select word as term, COUNT(*) AS freq FROM Words WHERE ts > ? and ts < ? GROUP BY term ORDER BY COUNT(*) DESC LIMIT 4";
  db.query(pollQuery, [start, end, start, end], function (err, result, fields) {
    if (err) throw err;
    var data = Object.values(JSON.parse(JSON.stringify(result)));
    sendData(data);
  });

  function sendData(data) {
  const dataToSend = JSON.stringify(data);
  console.log(dataToSend, "length", dataToSend.length, "type", typeof(dataToSend));
  res.write(`retry:`+updateSpeed+`000\n`);
  res.write(`data:${dataToSend}`);
  res.write("\n\n");
  clearInterval(pollTimer);
  res.end();
  }
  return;
}

chatprocessing.get('/polling', (req, res)=>{
  sendPoll(req,res);
});
chatprocessing.post("/addOption", (req, res) => {
  var temp = req.body.input.toLowerCase();
  console.log("Input recieved is " + temp);
  if(!pollOptions.includes(temp)){
    pollOptions.push(temp);
    console.log("Options is:" + pollOptions);
    addtoOptions(db, temp);
  }
})
chatprocessing.post("/resetOptions", (req, res) => {
  console.log("Reset has been pressed.");
  pollOptions = [];
  console.log("Options is:" + pollOptions);
  clearOptions(db);
})
chatprocessing.post("/rangeUpdate", (req, res) => {
  sliderStart = req.body.start;
  sliderEnd = req.body.stop;
  console.log("Range has been updated.");
  console.log("Start: ", sliderStart, "Stop: ", sliderEnd);
})
chatprocessing.post("/speedUpdate", (req, res) => {
  updateSpeed = req.body.speed;
  console.log("Speed has been updated.");
  console.log("Speed: ", updateSpeed);
})

module.exports = chatprocessing;



////////// Utility Functions -----------------------------------
function clearEmotes(db){
  db.query("DELETE FROM Emotes", function(err, result){
    if (err) throw err;
    console.log("Previous Emotes Deleted");
  });
  db.query("ALTER TABLE Emotes AUTO_INCREMENT = 1", function(err, result){
    if (err) throw err;
    console.log("emoteID counter has been reset to 1.");
  });
}
function clearMessages(db){
  db.query("DELETE FROM Messages", function(err, result){
    if (err) throw err;
    console.log("Previous Messages Deleted");
  });
  db.query("ALTER TABLE Messages AUTO_INCREMENT = 1", function(err, result){
    if (err) throw err;
    console.log("messageID counter has been reset to 1.");
  });
}
function clearWords(db){
    db.query("DELETE FROM Words", function(err, result){
      if (err) throw err;
      console.log("Previous Words Deleted");
    });
    db.query("ALTER TABLE Words AUTO_INCREMENT = 1", function(err, result){
      if (err) throw err;
      console.log("wordID counter has been reset to 1.");
    });
}
function clearOptions(db){
  db.query("DELETE FROM Options", function(err, result){
    if (err) throw err;
    console.log("Previous Options Deleted");
  });
  db.query("ALTER TABLE Options AUTO_INCREMENT = 1", function(err, result){
    if (err) throw err;
    console.log("optionID counter has been reset to 1.");
  });
}
function addtoOptions(db, w){
  db.query("INSERT INTO Options (word) VALUES (?)", [w], function (err, result) {
    if (err) console.log('Option Not Inserted.')
    console.log ("Option Inserted");
  });
}

function renderPrototype(chname, res){
  const tmi_options = {
    options: {debug: true},
    identity: {
      username: 'username', 
      password: '0fbzrr2svxhwmh6kxd0mixcsxd1q0c', // TODO: Make Private
    },
    channels: [
      chname // dead channel to initial
    ],
  };
  chnl = chname;
  let tmiClient = new tmi.client(tmi_options);
  chatid = 0;
  tmiClient.on('connected', onConnectedHandler);
  tmiClient.on('message', onMessageHandler);
  tmiClient.connect().catch(console.error);
  let ChatInstance = new twitchemoteparser.Chat({
    channel: chname,
    duplicateEmoteLimit: 5,
    duplicateEmoteLimitPleb: null,
    emoteSettings:{
      channelEmotes: false,
      bttv: true,
      bttvGlobal: true,
      ffz: true,
      ffzGlobal: true,
      sevenTV: true,
      sevenTVGlobal: true
    },
    maxEmoteLimit: 10
  });
  ChatInstance.on("emotes", (emotes)=>{
      console.log("CHATPROCESSING: ",emotes, "-----");
      for(i=0; i<emotes.length; i++){
        if (emotes[i].emote.length!= 0){
          console.log(emotes[i].emote[0]);
          key = "emote:"+emoteid;
          //Insert into EMOTES DATABASE
            var add_emote = "INSERT INTO Emotes (link, ts) VALUES (?, ?)";
            db.query(add_emote, [emotes[i].emote[0].url, Date.now()], function (err, result) {
              if (err) throw err;
              console.log("1 emote inserted");
            });          
          emoteid++;
        }
      }
  });
  res.render('index', { name: chname});
}


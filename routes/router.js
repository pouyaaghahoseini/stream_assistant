var express = require('express');
var router = new express.Router();
const path = require('path');
const mysql = require('mysql');


const pdb = mysql.createConnection({
  user:'root',
  host:'localhost',
  password:'123456',
  database: 'Volunteers'
})



let participant_id=0;
// index page. These loads the directories we need
router.use(express.static('public'))
router.use('/css', express.static('/home/aghahosp/myapp/public/css'))
router.use('/js', express.static('/home/aghahosp/myapp/public/js'))
router.use('/img', express.static('/home/aghahosp/myapp/public/img'))

// study page. These loads the directories we need
router.use(express.static('public'))
router.use('/study/assets/css', express.static('/home/aghahosp/myapp/study/assets/css'))
router.use('/study/assets/js', express.static('/home/aghahosp/myapp/study/assets/js'))
router.use('/study/images', express.static('/home/aghahosp/myapp/study/images'))
router.use('/study/assets/webfonts', express.static('/home/aghahosp/myapp/study/assets/webfonts'))

// info page
router.use(express.static('public'))
router.use('/info/assets/css', express.static('/home/aghahosp/myapp/info/assets/css'))
router.use('/info/assets/js', express.static('/home/aghahosp/myapp/info/assets/js'))
router.use('/info/assets/sass', express.static('/home/aghahosp/myapp/info/assets/sass'))
router.use('/info/assets/webfonts', express.static('/home/aghahosp/myapp/info/assets/webfonts'))
router.use('/info/images', express.static('/home/aghahosp/myapp/info/images'))

pdb.connect(function(err) {
  if(err) throw err;
  console.log("Connected to Participants Database!");
});

router.get('/info', function(req, res) {
    res.sendFile(path.join('/home/aghahosp/myapp/info/index.html'));
  });
router.get('', function(req, res) {
    res.sendFile(path.join('/home/aghahosp/myapp/study/index.html'));
  });

// Store the volunteer information in the redis database.
router.post("", function(req, res){
    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;
    filePath = __dirname + "/study/data.txt";
    input_data = JSON.stringify(req.body) + '\n';
    
    var sql = "INSERT INTO Participants (Name, Email, Message) VALUES ('"+ name + "', '" + email + "', '" + message + "');";
    pdb.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 participant record inserted");
      res.redirect("/saved");
    });


  // pdb.connect(function(err) {
  //   if (err) throw err;
  //   console.log("Connected!");
  //   var sql = "INSERT INTO Participants (Name, Email, Message) VALUES ('"+ name + "', '" + email + "', '" + message + "');";
  //   pdb.query(sql, function (err, result) {
  //     if (err) throw err;
  //     console.log("1 participant record inserted");
  //     res.redirect("/saved");
  //   });
  // });


    console.log("NAME " + name + " EMAIL " + email + " MESSAGE " + message);
    key = "participant:"+participant_id;
    participant_id++;
  });
  router.get('/saved', function(req, res){
    res.sendFile("/home/aghahosp/myapp/study/saved.html");
});
module.exports = router;
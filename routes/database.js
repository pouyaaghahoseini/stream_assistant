var express = require('express');
var database = new express.Router();
const emoteParser = require("tmi-emote-parse");
const tmi = require('tmi.js');
const twitchemoteparser = require("twitch-emote-parser");
const { link } = require('fs');
const { time, debug } = require('console');
const mysql = require('mysql');


const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:'123456',
    database: 'CHAT'
})
db.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
    var message_delete_query = "DELETE FROM Messages";
    var message_resetID_query = "ALTER TABLE Messages AUTO_INCREMENT = 1";
    db.query(message_delete_query, function(err, result){
      if (err) throw err;
      console.log("Previous Messages Deleted");
    });
    db.query(message_resetID_query, function(err, result){
      if (err) throw err;
      console.log("messageID counter has been reset to 1.");
    });
  });

  ////CREATE TABLE Channels (id int NOT NULL AUTO_INCREMENT, channel varchar(50) NOT NULL, password varchar(255) NOT NULL, PRIMARY KEY (id));

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sql = "CREATE TABLE Emotes (emoteID int NOT NULL AUTO_INCREMENT, link VARCHAR(550) NOT NULL, ts VARCHAR(255) NOT NULL, name VARCHAR(255), username VARCHAR(255), PRIMARY KEY (emoteID))";
//     db.query(sql, function(err, result){
//     if (err) throw err;
//     console.log("Table Created!");
//     })
// });


// db.connect(function(err) {
//         if (err) throw err;
//         console.log("Connected!");
//         var sql = "CREATE TABLE Messages (messageID int NOT NULL AUTO_INCREMENT,  username VARCHAR(255), message VARCHAR(550) NOT NULL, ts VARCHAR(255) NOT NULL, user_id VARCHAR(255) NOT NULL, PRIMARY KEY (messageID))";
//         db.query(sql, function(err, result){
//         if (err) throw err;
//         console.log("Table Created!");
//         })
//     });


// db.connect(function(err) {
//         if (err) throw err;
//         console.log("Connected!");
//         var sql = "CREATE TABLE Words (wordID int NOT NULL AUTO_INCREMENT, username VARCHAR(255), word VARCHAR(100) NOT NULL, ts VARCHAR(255) NOT NULL, user_id VARCHAR(255) NOT NULL, PRIMARY KEY (wordID))";
//         db.query(sql, function(err, result){
//         if (err) throw err;
//         console.log("Table Created!");
//         })
//     });
module.exports = database;



// CREATE TABLE Options (optionID int NOT NULL AUTO_INCREMENT, word VARCHAR(50) NOT NULL, PRIMARY KEY (optionID) );


// MySQL Queries to clean up the words.
/*

DELETE FROM Words WEHERE 


create participants:
Create Table Participants (ParticipantID int NOT NULL AUTO_INCREMENT, Name VARCHAR(255), Email VARCHAR(255), Message VARCHAR(500), PRIMARY KEY (ParticipantID));

Update Parsing Set Type="copula" Where w_id >37;
Insert Into Parsing (Word) Values


("nor"), ("whether"), ("though"), ("because"), ("but"), ("for"), ("and"), ("if"),("however"),("before"),
("although"),("how"),("plus"),("versus"),("not")
("where'd"),("when'd"),("how'd"),("what'd"),("said"),("had"),("been"),("began"),("came"),("did"),("meant"),("went")
("going"),("being"),("according"),("resulting"),("developing"),("staining")



("is"), ("will be"), ("are"), ("was"), ("were"), ("am"), ("isn't"), ("ain't"), ("aren't"),



("this"), ("any"), ("enough"), ("each"), ("every"), ("which"), 
("these"), ("another"), ("plenty"), ("whichever"), 
("an"), ("a"), ("least"),("own"),("few"), ("those"),
      ("the"),("that"),("various"),("what"),("either"),("much"),("some"),
      ("else"),("la"),("le"), ("les"),("des"),("de"),("du"),("el")



      Insert Into Parsing (Word) Values
      ("until"),("onto"),("of"), ("into"),("out"),("except"),("across"),("by"),("between"),("at"),
      ("down"),("as"), ("from"),("around"),("with"),("among"), ("upon"), ("amid"),("to"),("along"),
      ("since"),("about"), ("off"), ("on"), ("within"), ("in"), ("during"),("per"),("without"),
      ("throughout"), ("through"), ("than"),("via"), ("up"),("unlike"), ("despite"),
      ("below"), ("unless"),("towards"), ("besides"),("after"), ("whereas"),("'o"), ("amidst"),("amongst"),
      ("apropos"),("atop"),("barring"),("chez"),("circa"),("mid"), ("midst"),
      ("notwithstanding"), ("qua"),("sans"), ("vis-a-vis"),("thru"), ("till"),
      ("versus"), ("without"), ("w/o"), ("o'"),("a'");
      Update Parsing Set Type="presposition" Where w_id >77;

      Insert Into Parsing (Word) Values
      ("can"),("may"),("could"),("might"),("will"),("ought to"),("would"),
      ("must"),("shall"),("should"),("ought"),("shouldn't"),("wouldn't"),("couldn't"),
      ("mustn't"),("shan't"),("shant"),("lets"),("who'd"),("let's");
      Update Parsing Set Type="verb" Where w_id >140;
      

      Insert Into Parsing (Word) Values
      ("mine"),("something"),
      ("none"),("anything"), ("anyone"),("theirs"),("himself"),
      ("ours"),("his"),("my"),("their"),("yours"),
      ("your"),("our"),("its"), ("nothing"),
      ("herself"),("hers"),("themselves"),("everything"),("myself"),("itself"),
      ("her"),("who"),("whom"),("whose")
      ("it"), ("they"),("i"),("them"),("you"),("she"),
      ("me"),("he"),("him"),("ourselves"),("us"),
      ("we"),("thou"),("il"), ("elle"),("yourself"),("'em");
      Select * From Parsing;
      Update Parsing Set Type="verb" Where w_id >160;



// Adverbs
      Insert Into Parsing (Word) Values
      ("now"),("again"),("already"),("soon"),
      ("directly"),("toward"),("forever"),("apart"),("instead"),("yes"),
      ("alone"),("ago"),("indeed"),("ever"),("quite"),("perhaps"),
      ("where"),("then"),("here"),("thus"),("very"),("often"),("once"),("never"),
      ("why"),("when"),("away"),("always"),("sometimes"),("also"),("maybe"),
      ("so"),("just"),("well"),
      ("several"),("such"),("randomly"),("too"),("rather"),
      ("abroad"),("almost"),("anyway"),
      ("twice"),("aside"),("moreover"),("anymore"),("newly"),
      ("damn"),("somewhat"),("somehow"),("meanwhile"),
      ("hence"),("further"),("furthermore")
      Select * From Parsing;
      Update Parsing Set Type="adverb" Where w_id >203;



//Interhections
      Insert Into Parsing (Word) Values
      ("uhh"), ("uh-oh"),("ugh"),("sheesh"), ("eww"),
      ("pff"),("voila"),("oy"), ("eep"),("hurrah"),("yuck"), ("ow"), ("duh"),
      ("oh"), ("hmm"),("whoa"),("ooh"),("whee"), ("ah"), ("bah"),("gah"),("yaa"), ("phew"),("gee"), ("ahem"),
      ("eek"),("meh"), ("yahoo"), ("oops"), ("d'oh"),("psst"), ("argh"), ("grr"),
      ("shhh"), ("whew"),("mmm"),("yay"),("uh-huh"),("boo"),("wow");
      Select * From Parsing;
      Update Parsing Set Type="interjection" Where w_id >257;



      Insert Into Parsing (Word) Values
      ("word"),("will"),("one"),("two"),("three"),("four"),("five"),("six"),("seven"),("eight"),
("nine"),("ten"),("-"),("a"),("able"),("about"),("above"),("abst"),("accordance"),("according"),
("accordingly"),("across"),("act"),("actually"),("added"),("adj"),("affected"),("affecting"),("affects"),("after"),
("afterwards"),("again"),("against"),("ah"),("all"),("almost"),("alone"),("along"),("already"),("also"),
("although"),("always"),("am"),("among"),("amongst"),("an"),("and"),("announce"),("another"),("any"),
("anybody"),("anyhow"),("anymore"),("anyone"),("anything"),("anyway"),("anyways"),("anywhere"),("apparently"),("approximately"),
("are"),("aren"),("arent"),("aren't"),("arise"),("around"),("as"),("aside"),("ask"),("asking"),
("at"),("auth"),("available"),("away"),("awfully"),("b"),("back"),("be"),("became"),("because"),
("become"),("becomes"),("becoming"),("been"),("before"),("beforehand"),("begin"),("beginning"),("beginnings"),("begins"),
("behind"),("being"),("believe"),("below"),("beside"),("besides"),("between"),("beyond"),("biol"),("both"),
("brief"),("briefly"),("but"),("by"),("c"),("ca"),("came"),("can"),("cannot"),("can't"),
("cause"),("causes"),("certain"),("certainly"),("co"),("com"),("come"),("comes"),("contain"),("containing"),
("contains"),("could"),("couldnt"),("couldn't"),("d"),("date"),("did"),("didn't"),("do"),("does"),
("doesnt"),("doesn't"),("doing"),("done"),("dont"),("don't"),("down"),("downwards"),("due"),("during"),
("e"),("each"),("ed"),("edu"),("effect"),("eg"),("eight"),("eighty"),("either"),("else"),
("elsewhere"),("end"),("ending"),("enough"),("especially"),("et"),("et-al"),("etc"),("even"),("evenly"),
("ever"),("every"),("everybody"),("everyone"),("everything"),("everywhere"),("except"),("f"),("far"),("few"),
("ff"),("following"),("follows"),("for"),("former"),("formerly"),("found"),("from"),("further"),("furthermore"),
("g"),("gave"),("get"),("gets"),("getting"),("give"),("given"),("gives"),("giving"),("go"),
("goes"),("gone"),("got"),("gotten"),("h"),("had"),("happens"),("hardly"),("has"),("hasnt"),
("hasn't"),("have"),("havent"),("haven't"),("having"),("he"),("hed"),("he'd"),("he'll"),("hence"),
("her"),("here"),("hereafter"),("hereby"),("herein"),("heres"),("hereupon"),("hers"),("herself"),("hes"),
("he's"),("hi"),("him"),("himself"),("his"),("how"),("how's"),("howbeit"),("however"),("i"),
("id"),("i'd"),("ie"),("if"),("i'll"),("im"),("i'm"),("immediate"),("immediately"),("in"),
("inc"),("indeed"),("index"),("instead"),("into"),("inward"),("is"),("isnt"),("isn't"),("it"),
("itd"),("it'd"),("itll"),("it'll"),("its"),("it's"),("itself"),("ive"),("i've"),("j"),
("just"),("k"),("keep"),("keeps"),("kept"),("know"),("known"),("knows"),("l"),("largely"),
("last"),("lately"),("later"),("latter"),("latterly"),("least"),("less"),("lest"),("let"),("lets"),
("like"),("liked"),("likely"),("line"),("little"),("'ll"),("look"),("looking"),("looks"),("ltd"),
("m"),("made"),("mainly"),("make"),("makes"),("many"),("may"),("maybe"),("me"),("mean"),
("means"),("meantime"),("meanwhile"),("merely"),("mg"),("might"),("million"),("miss"),("ml"),("more"),
("moreover"),("most"),("mostly"),("mr"),("mrs"),("much"),("mug"),("must"),("my"),("myself"),
("n"),("na"),("name"),("namely"),("nay"),("nd"),("near"),("nearly"),("necessarily"),("necessary"),
("need"),("needs"),("neither"),("never"),("nevertheless"),("new"),("next"),("no"),("nobody"),("non"),
("none"),("nonetheless"),("noone"),("nor"),("normally"),("nos"),("not"),("noted"),("nothing"),("now"),
("nowhere"),("o"),("obviously"),("of"),("off"),("often"),("oh"),("ok"),("okay"),("on"),
("once"),("ones"),("one's"),("only"),("onto"),("or"),("ord"),("other"),("others"),("otherwise"),
("ought"),("our"),("ours"),("ourselves"),("out"),("outside"),("over"),("overall"),("owing"),("own"),
("p"),("part"),("particular"),("particularly"),("past"),("per"),("perhaps"),("please"),("plus"),("possible"),
("possibly"),("potentially"),("pp"),("previously"),("primarily"),("probably"),("promptly"),("put"),("q"),("que"),
("quickly"),("quite"),("qv"),("r"),("rather"),("rd"),("re"),("'re"),("readily"),("really"),
("recent"),("recently"),("ref"),("refs"),("regarding"),("regardless"),("regards"),("related"),("relatively"),("respectively"),
("resulted"),("resulting"),("retweet"),("rt"),("s"),("'s"),("said"),("same"),("saw"),("say"),
("saying"),("says"),("sec"),("seem"),("seemed"),("seeming"),("seems"),("seen"),("self"),("selves"),
("sent"),("several"),("shall"),("she"),("she'd"),("she'll"),("shes"),("she's"),("should"),("shouldn't"),
("showed"),("shown"),("showns"),("shows"),("significant"),("significantly"),("similar"),("similarly"),("since"),("slightly"),
("so"),("some"),("somebody"),("somehow"),("someone"),("somethan"),("something"),("sometime"),("sometimes"),("somewhat"),
("somewhere"),("soon"),("sorry"),("specifically"),("specified"),("specify"),("specifying"),("still"),("stop"),("strongly"),
("sub"),("substantially"),("successfully"),("such"),("sufficiently"),("sup"),("'sup"),("sure"),("t"),("take"),
("taken"),("taking"),("tell"),("tends"),("th"),("than"),("thank"),("thanks"),("thanx"),("that"),
("that'll"),("thats"),("that's"),("that've"),("the"),("their"),("theirs"),("them"),("themselves"),("then"),
("thence"),("there"),("thereafter"),("thereby"),("thered"),("there'd"),("therefore"),("therein"),("there'll"),("thereof"),
("therere"),("there're"),("theres"),("there's"),("thereto"),("thereupon"),("there've"),("these"),("they"),("theyd"),
("they'd"),("they'll"),("theyre"),("they're"),("theyve"),("they've"),("think"),("thinks"),("this"),("those"),
("thou"),("though"),("thoughh"),("thousand"),("throug"),("through"),("throughout"),("thru"),("thus"),("til"),
("to"),("together"),("too"),("took"),("tooks"),("toward"),("towards"),("tried"),("tries"),("truly"),
("try"),("trying"),("ts"),("twice"),("u"),("un"),("under"),("unfortunately"),("unless"),("unlike"),
("unlikely"),("until"),("unto"),("up"),("upon"),("ups"),("us"),("use"),("used"),("useful"),
("usefully"),("usefulness"),("uses"),("using"),("usually"),("v"),("value"),("various"),("'ve"),("very"),
("via"),("viz"),("vol"),("vols"),("vs"),("w"),("want"),("wants"),("was"),("wasnt"),
("wasn't"),("way"),("we"),("wed"),("we'd"),("welcome"),("we'll"),("well"),("went"),("were"),
("we're"),("weren't"),("we've"),("what"),("whatever"),("what'll"),("whats"),("what's"),("when"),("whence"),
("whenever"),("where"),("whereafter"),("whereas"),("whereby"),("wherein"),("wheres"),("where's"),("whereupon"),("wherever"),
("whether"),("which"),("while"),("whim"),("who"),("whod"),("who'd"),("whoever"),("whole"),("who'll"),
("whom"),("whomever"),("whos"),("who's"),("whose"),("why"),("widely"),("willing"),("wish"),("with"),
("within"),("without"),("won't"),("words"),("world"),("would"),("wouldn't"),("x"),("y"),("yes"),
("yet"),("you"),("youd"),("you'd"),("youll"),("you'll"),("your"),("you're"),("youre"),("yours"),

Update Parsing Set Type="misc" Where w_id >297;


      Insert Into Parsing (Word) Values
      ("i've"), ("you've"),("he've"),("she've"), ("we've"), ("they've"),
      ("i'm"),("he's"), ("she's"),("you're"),("they're"), ("we're"),
      ("oh"), ("hmm"),("whoa"),("ooh"),("whee"), ("ah"), ("bah"),("gah"),("yaa"), ("phew"),("gee"), ("ahem"),
      ("eek"),("meh"), ("yahoo"), ("oops"), ("d'oh"),("psst"), ("argh"), ("grr"),
      ("shhh"), ("whew"),("mmm"),("yay"),("uh-huh"),("boo"),("wow");
      Select * From Parsing;
      Update Parsing Set Type="interjection" Where w_id >257;


*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const nextTick = require('process');
const { channel } = require('diagnostics_channel');
const { response } = require('express');
// const { Server } = require('http');
// fs = require('fs');

const app = express()
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false})) // allows us to access forms in post method

app.get('/status', (request, response) => response.json({clients: clients.length}));
let clients = [];
let facts = [];

// this allows us to use EJS templates
app.set('views', './views')
app.set('view engine', 'ejs') 
app.use((req, res, next) => {
  console.log('-----------------------------Time:', Date.now())
  next()
});
// app.use(require("./routes/utilities"));
app.use(require("./routes/database"));
app.use(require("./routes/chatprocessing"));
app.use(require("./routes/router"));
app.listen(port, () => console.info('Listening on port ${port}'))
const express = require('express')
const app = express()

// app.set('views', __dirname + '/views')
// app.set('view engine', 'ejs')


// index page
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/img', express.static(__dirname + '/public/img'))

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
  res.render('index', { text: 'Hey' })
})

app.get('/about', (req, res) => {
 res.sendFile(__dirname + '/views/about.html')
})

app.listen(3000, () => console.info('Listening on port ${port}'))

/* FILE NAME: server.js
 * PROGRAMMER: Fabrika Artem
 * DATE: 13.07.2021
 * PERPOSE: server file
 */

const express = require('express')
const app = express()
const port = 3000

const start = require('./parser.js').start;

app.use(express.static(__dirname))

app.get('/parse', (req, res) => {
  start(req.query.url, (word_array) => {
    res.send(word_array);
  })
})
app.get('/', (req, res) => {
  res.sendFile(__dirname+'/web.html');
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/* END OF 'server.js' FILE */

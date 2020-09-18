var express    = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  console.log('aeee ' +  JSON.stringify(req.body))
  next()
})

app.post('/hello', function (req, res) {
  console.log(JSON.stringify(req.body) + ' yoooooo');
//   res.send('hello : ' + JSON.stringify(req.body));
res.json([{"ABC":"1002"},{"DDD":"111"}]);
});

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });

module.exports = app;
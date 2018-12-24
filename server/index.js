var express = require('express');
var app = express();

require('dotenv').config()

app.set('port', (process.env.PORT || 5000));

// app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
  var env = process.env.APP_ENV;
  if (env == 'staging') {
    var envName = 'staging'
  } else if (env == 'production') {
    var envName = 'production'
  } else {
    var envName = 'review app'
  }
  response.render('index.html', { env: envName });
});

if (!module.parent) {
  app.listen(app.get('port'), function () {
    console.log("Node app running at localhost:" + app.get('port'));
  });
}

module.exports = app

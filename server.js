var express = require('express');
var request = require('request');
var cors = require('cors');

var embedlyKey = process.env.EMBEDLY_KEY;
var instaKey = process.env.INSTA_KEY;

var app = express();
app.use(express.static('public'));
app.use(cors());

app.get('/', function(req, res) {
  res.render('index.ejs', {});
});

app.get('/images', function(req, res) {
  var tag = "snow";
  var url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=" + instaKey;
  var imageUrls = []
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var parsed = JSON.parse(body);
      var results = parsed.data;
      var topResults = results.slice(0, 5);
      topResults.forEach(function(result){
        imageUrls.push(result.images.low_resolution.url);
      });
      res.send(imageUrls);
    }
  })
});

app.get('/colors', function(req, res) {
  var url1 = "http://upload.wikimedia.org/wikipedia/commons/4/4a/Snow_on_the_mountains_of_Southern_California.jpg";
  var url2 = "http://upload.wikimedia.org/wikipedia/commons/4/4a/Snow_on_the_mountains_of_Southern_California.jpg";
  var url3 = "http://upload.wikimedia.org/wikipedia/commons/4/4a/Snow_on_the_mountains_of_Southern_California.jpg";
  // var url4 = images[3];
  // var url5 = images[4];

  var url = "http://api.embed.ly/1/extract?key=" + embedlyKey + "&urls=" + url1 + "," + url2 + "," + url3;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var parsed = JSON.parse(body);
      var colorsArray = [];
      parsed.forEach(function(result){
        var colors = result.images[0].colors;
        colorsArray.push(colors);
      });
      res.send(colorsArray);
    }
  })
});

var server = app.listen(3000, function() {
  console.log('Server is listening on port 3000');
});
88

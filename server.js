var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cors = require('cors');

var embedlyKey = process.env.EMBEDLY_KEY;
var instaKey = process.env.INSTA_KEY;

var app = express();
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json({extended: false}));

app.get('/', function(req, res) {
  res.render('index.ejs', {});
});

app.get('/colors', function(req, res) {
  var tag = "sunset";
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

      var url1 = imageUrls[0];
      var url2 = imageUrls[1];
      var url3 = imageUrls[2];
      var url4 = imageUrls[3];
      var url5 = imageUrls[4];

      var url = "http://api.embed.ly/1/extract?key=" + embedlyKey + "&urls=" + url1 + "," + url2 + "," + url3 + "," + url4 + "," + url5;

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var parsed = JSON.parse(body);
          var colorsArray = [];
          parsed.forEach(function(result){
            var colors = result.images[0].colors;
            colorsArray.push(colors);
          });
          res.json([colorsArray, imageUrls]);
        }
      })
      // res.json(imageUrls);
    }
  })
});

var server = app.listen(3000, function() {
  console.log('Server is listening on port 3000');
});
88

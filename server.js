var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cors = require('cors');
var colorPalette = require("colors-palette");

var embedlyKey = process.env.EMBEDLY_KEY;
var instaKey = process.env.INSTA_KEY;
var flickrKey = process.env.FLICKR_KEY;

var app = express();
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json({extended: false}));

app.get('/', function(req, res) {
  res.render('index.ejs', {});
});

app.get('/palette', function(req, res) {
  var tag = req.query.tag;
  var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&tags=" + tag + "&api_key=" + flickrKey + "&format=json&nojsoncallback=?";

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data = JSON.parse(body);
      var photos = data.photos.photo;
      colorsArray = [];
      var imageUrls = [];

      photos.forEach(function(each){
        var farm_id = each.farm;
        var server_id = each.server;
        var photo_id = each.id;
        var secret = each.secret;
        var resultUrls = "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + photo_id + "_" + secret + "_" + "m.jpg";
        imageUrls.push(resultUrls);
      });


      var topResults = imageUrls.splice(0, 10);
      topResults.forEach(function(url){
        colorPalette(url, 8, function(err, colors){
          if(err){
              console.error(err);
              return false;
            }
          colorsArray.push(colors);
        });
      });


      console.log(colorsArray);
    }
    res.render('palette.ejs', {topResults: topResults, colorsArray: colorsArray});
  })
});



var server = app.listen(3000, function() {
  console.log('Server is listening on port 3000');
});

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
      var imageUrls = [];
      photos.forEach(function(each){
        var farm_id = each.farm;
        var server_id = each.server;
        var photo_id = each.id;
        var secret = each.secret;
        var resultUrls = "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + photo_id + "_" + secret + "_" + "m.jpg";
        imageUrls.push(resultUrls);
      });

      colorsArray = [];

      var topResults = imageUrls.splice(0, 10);

      topResults.forEach(function(url){
        colorPalette(url, 8, function(err, colors){
            if(err){
                console.error(err);
                return false;
            }
        colorsArray.push(colors)
        });
      })

      console.log(colorsArray);

      res.render('palette.ejs', {topResults: topResults, colorsArray: colorsArray});
    }
  })
});


// app.get('/palette', function(req, res) {
//
//   // var tag = "fire";
//
//   var tagTest = req.params.tag;
//   console.log(tagTest);
//
//   var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&tags=" + tagTest + "&api_key=" + flickrKey + "&format=json&nojsoncallback=?";
//
//   request(url, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var parsed = JSON.parse(body);
//       var photos = parsed.photos.photo;
//       var imageUrls = [];
//       var topResults = photos.slice(0, 10);
//
//       topResults.forEach(function(each){
//         var farm_id = each.farm;
//         var server_id = each.server;
//         var photo_id = each.id;
//         var secret = each.secret;
//         var resultUrls = "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + photo_id + "_" + secret + "_" + "m.jpg";
//         imageUrls.push(resultUrls);
//       })
//
//       var url1 = imageUrls[0];
//       var url2 = imageUrls[1];
//       var url3 = imageUrls[2];
//       var url4 = imageUrls[3];
//       var url5 = imageUrls[4];
//       var url6 = imageUrls[5];
//       var url7 = imageUrls[6];
//       var url8 = imageUrls[7];
//       var url9 = imageUrls[8];
//       var url10 = imageUrls[9];
//
//       var url = "http://api.embed.ly/1/extract?key=" + embedlyKey + "&urls=" + url1 + "," + url2 + "," + url3 + "," + url4 + "," + url5 + "," + url6 + "," + url7 + "," + url8 + "," + url9 + "," + url10;
//
//       request(url, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//           var parsed = JSON.parse(body);
//           var colorsArray = [];
//           parsed.forEach(function(result){
//             var colors = result.images[0].colors;
//             colorsArray.push(colors);
//           });
//
//           res.json([colorsArray, imageUrls]);
//         }
//       })
//     }
//   })
// });

var server = app.listen(3000, function() {
  console.log('Server is listening on port 3000');
});

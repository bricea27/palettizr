var ul = document.querySelector("ul");
getColors();



function getColors() {
  var url = "/colors";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.addEventListener('load', function(e) {
    data = xhr.responseText;
    parsed = JSON.parse(data);
    parsed.forEach(function(result){
      result.forEach(function(colorsArray){
        var color = colorsArray.color;
        var r = color[0];
        var g = color[1];
        var b = color[2];
        var li = document.createElement("li");
        var span = document.createElement("span");
        var hex1 = r.toString(16);
        var hex2 = g.toString(16);
        var hex3 = b.toString(16);
        var hexString = "#" + hex1 + hex2 + hex3;
        span.innerHTML = hexString;
        li.style.background = "rgb(" + r + "," + g + "," + b + ")";
        ul.appendChild(li);
        li.appendChild(span);
      });
    });
  });
  xhr.send();
}

var img = document.querySelector("img");
img.addEventListener("click", function(){
  var url = this.src;
  getPalette(url);
});


function getPalette(url){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.addEventListener('load', function(e) {
    console.log(xhr.responseText)
  });
  xhr.send();
};

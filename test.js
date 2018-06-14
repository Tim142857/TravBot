var urls = [];

var hydrateUrls = function(array){
  urls = array;
}

var sendPing = function(url){
  // Send ping to the url
}

var timer = 0;
var repeat = function(url){
  // main treatment
  sendPing(url);
  timer = Math.random() * 1000;

  // After treatment, just call itself with random timer
  setTimeout(repeat, timer);
}

var stopLoop = function(){
  //  ??
}

var main = function(){
  urls.forEach(elm => {
    // Begin infinite loop for each url
    repeat(elm);
  })
}

// la question est de savoir comment gérer chaque boucle (start/resume/stop par exemple) séparemment

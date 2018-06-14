const _ = require('lodash')
module.exports = {
  loadJquery: function(cb){
    (function() {
      var startingTime = new Date().getTime();
      // Load the script
      var script = document.createElement("SCRIPT");
      script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
      script.type = 'text/javascript';
      script.onload = function() {
        var $ = window.jQuery;
        cb($);
      };
      document.getElementsByTagName("head")[0].appendChild(script);
    })();
  },
  millisToMinutesAndSeconds: function(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + "m " + (seconds < 10 ? '0' : '') + seconds + 's';
  },
  sleep: function(ms) {
    var start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) { }
    return;
  },
  shuffleObject: function(obj, cb) {
    // Get object key into tmp array in random order
    var keys = this.shuffle(_.keys(obj));

    // instantiate new object who will be returned
    var newObj = {};

    // Iterate over keys to populate object with same properties in a different order
    keys.forEach(function(elm, index){
      newObj[elm] = obj[elm];
      if(index === keys.length-1){
        cb(newObj);
      }
    })
  },
  shuffle: function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },
  convertMinToMili: function(min){
    return min * 60 * 1000;
  },
  convertMinToSeconds: function(mili){
    return mili / (60 * 1000);
  },
  getActualDate: function(){
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear() + " - "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
    return datetime;
  },
  debug: function(message, important){
    var log="";
    if(important) log += "##########################################################################################"+"\n";
    log += this.getActualDate()+ " - " + message +"\n";
    if(important) log += "##########################################################################################"+"\n";
    console.log(log);
  },
  getRandomBoolean(percentOfTrue){
    var percent = Math.floor(Math.random() * 100);
    return percent < percentOfTrue;
  }
}

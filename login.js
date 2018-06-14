const ipcRenderer = require('electron').ipcRenderer;
(function() {
  var startingTime = new Date().getTime();
  // Load the script
  var script = document.createElement("SCRIPT");
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
  script.type = 'text/javascript';
  script.onload = function() {
    var $ = window.jQuery;
    $(document).ready(function(){
      var config = ipcRenderer.sendSync('get-logs');
      document.querySelector('input[name=name]').value = config.name;
      document.querySelector('input[name=password]').value = config.password;
      document.querySelector('form[name=login]').submit();
    })
  };
  document.getElementsByTagName("head")[0].appendChild(script);
})();

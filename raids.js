const ipcRenderer = require('electron').ipcRenderer;
(function() {
  var startingTime = new Date().getTime();
  // Load the script
  var script = document.createElement("SCRIPT");
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
  script.type = 'text/javascript';
  script.onload = function() {
    var $ = window.jQuery;

    function randomSort(elm){
      var rdm = Math.floor((Math.random() * 4) + 1);
      switch(rdm){
        case 1:
        elm.find("input[name='sort']").val('distance');
        elm.find("input[name='direction']").val('desc');
        break;
        case 2:
        elm.find("input[name='sort']").val('distance');
        elm.find("input[name='direction']").val('asc');
        break;
        case 3:
        elm.find("input[name='sort']").val('ew');
        elm.find("input[name='direction']").val('desc');
        break;
        case 4:
        elm.find("input[name='sort']").val('ew');
        elm.find("input[name='direction']").val('asc');
        break;
        default:
        break;
      }
    }
    var sleep = function(ms) {
      var start = new Date().getTime(), expire = start + ms;
      while (new Date().getTime() < expire) { }
      return;
    }

    $(document).ready(function(){
      var { lists, currentList } = ipcRenderer.sendSync('get-raids-settings');
      var currentUrl = $(location).attr('href');
      var listName = Object.keys(lists)[currentList];
      var elmList = $('#'+listName);
      randomSort(elmList);
      elmList.find('.slotRow').each(function(index, elm){
        var lastRaid = $(elm).find('.lastRaid img:first-child').hasClass('iReport1');
        if(lastRaid){
          $($(elm).find('.markSlot')[0]).prop('checked', true)
        }else{
          //une chance sur 6 de relancer sur un blessé
          if(Math.floor(Math.random() * 6)===4){
            $($(elm).find('.markSlot')[0]).prop('checked', true)
          }
        }
        if(index === (elmList.find('.slotRow').length - 1)){
          $('html, body').animate({
            scrollTop: $(elm).offset().top - 300
          }, 2000);
          ipcRenderer.send('increment-currentList');
          setTimeout(function(){
            elmList.find('form').submit();
          }, 2500);
        }
      })
    })
  };
  document.getElementsByTagName("head")[0].appendChild(script);
})();

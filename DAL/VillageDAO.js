const Request = require('../DAL/Request.js');
const cheerio = require('cheerio');
const Config = require('../config.js');
const Utils = require('../utils.js');

module.exports = {
  getStorage: function(idVivi, cb){
    var url = "https://ts20.travian.fr/dorf1.php?newdid="+idVivi+"&";
    Request.send(url, function (error, body) {
      if(error)console.log(error);
      const $ = cheerio.load(body);
      cb({
        warehouseStorage: $('#stockBarWarehouse').text().replace(/\D/g,''),
        granaryStorage: $('#stockBarGranary').text().replace(/\D/g,'')
      });
    });
  },
  getStock: function(idVivi, cb){
    var url = "https://ts20.travian.fr/dorf1.php?newdid="+idVivi+"&";
    Request.send(url, function (error, body) {
      if(error)console.log(error);
      const $ = cheerio.load(body);
      cb({
        wood: $('#l1').text().replace(/\D/g,''),
        clay: $('#l2').text().replace(/\D/g,''),
        iron: $('#l3').text().replace(/\D/g,''),
        crop: $('#l4').text().replace(/\D/g,''),
      });
    });
  },
  formTroops: function(idVivi, troopType, nb){
    var idBuilding;
    switch(troopType){
      case "teuton":
      idBuilding = 34;
      break;
      default:
      break;
    }
    var url = "https://ts20.travian.fr/build.php?id=" + idBuilding;
    Request.send('https://ts20.travian.fr/dorf2.php?newdid='+idVivi+'&', function(){
      Request.send(url, function (error, body) {
        if(error)console.log(error);
        const $ = cheerio.load(body);
        var token = $("input[name='z']").val();
        var form = {
          id: 34,
          z: token,
          a: 2,
          s: 1,
          t5: 0,
          t6: nb,
          s1: 'ok'
        }
        Request.post({url:'https://ts20.travian.fr/build.php', form: form}, function(error,httpResponse,body){
          if(error) console.log("1----"+error);
          Utils.debug(nb+' teutons mis a former', true);
        })
      });
    })
  },
  doNPC: function(idVivi, ressWanted){

  },
  sendRessources: function(idViviSender, idViviTarget, ress){

  },
  build: function(){

  },
  clearRessources: function(idVivi){

  },

}

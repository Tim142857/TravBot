const Utils = require('./utils');
module.exports  = {
  sendRessources: function(sender, target, ress){
    var url = "https://ts20.travian.fr/build.php?newdid=" + sender + "&id=32&gid=17";
    request.post({url:'https://ts20.travian.fr/build.php?gid=16&tt=99', form: test, jar: j }, function(error,httpResponse,body){
      if(error) console.log("1----"+error);
      if(httpResponse) Utils.debug("Envoi de la liste "+listName+" du village "+idVivi+" ("+nbRaidsSend+" pillages envoyes)");
    })
  }
};

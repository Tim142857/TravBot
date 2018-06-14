var request = require('request');
const cheerio = require('cheerio');
const Config = require('../config.js');
request = request.defaults({jar: true})

module.exports = {
  send: function(url, cb){
    this.login(function(){
      request(url, function (error, response, body) {
        if(error) console.log(error);
        cb(error, body);
      });
    });
  },
  post: function(options, cb) {
    request.post(options, cb)
  },
  login: function(cb){
    var url = "https://ts20.travian.fr";
    request({url}, function (error, response, body) {
      if(error) console.log(error);
      const $ = cheerio.load(body);
      var token = $("input[name='login']").val();
      var loginForm = {
        name: Config.name,
        password: Config.password,
        s1: "Se connecter",
        w: "1536:864",
        login: token
      }
      request.post({url:'https://ts20.travian.fr/dorf1.php', form: loginForm}, function(error,httpResponse,body){
        if(error) console.log("1----"+error);
        if(!error && httpResponse) {
          cb();
        }
      });
    });
  }
}

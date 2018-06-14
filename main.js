const {app, BrowserWindow, remote, ipcMain, Menu, session} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');
const _ = require('lodash')
const request = require('request');
const cheerio = require('cheerio');
const Config = require('./config.js');
const Enum = require('./enum.js')
const Utils = require('./utils.js');
const Village = require('./Models/Village.js');



//scripts
var loginScript = fs.readFileSync('./login.js',{ encoding: 'utf8' });
// var testScript = fs.readFileSync('./test.js',{ encoding: 'utf8' });
var raidsScript = fs.readFileSync('./raids.js',{ encoding: 'utf8' });


// Redirect
var goToRaidsPage = function(data){
  console.log(Utils.getActualDate() + ': Envoi de la liste: '+data.key+' du vivi: '+data.value);
  var url = "build.php?newdid=" + data.value + "&id=39&tt=99&gid=16";
  win.loadURL(Config.serverUrl + url);
}

//Modes
var currentList = 0;
var activatedRaids = false;
var loop = 0;
var j;
// request = request.defaults({jar:j})

const template = [
  {
    label:'Options',
    submenu: [
      {
        label: 'Paramètres',
        click(){
          win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
          }))
        }
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
];
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function randomSort(elm){
  var rdm = Math.floor((Math.random() * 4) + 1);
  console.log(rdm);
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

var sendList = function(listName, idVivi, timer, onlyFull){
  var url = 'https://ts20.travian.fr/build.php?newdid=' + idVivi + '&id=39&tt=99&gid=16';
  var formToSend = {};
  setTimeout(function(){
    request({url, jar: j}, function (error, response, body) {
      if(error) console.log(error);
      const $ = cheerio.load(body);
      var list = $('#'+listName);
      var nbRaidsSend = 0;
      // randomSort(list);
      var testForm="{ ";
      list.find("input[type='hidden']").each(function(index, elm){
        testForm+='"'+$(elm).attr('name')+'": "'+$(elm).val()+'"';
        testForm += ",";
        formToSend[$(elm).attr('name')] = $(elm).val();
      });
      list.find('.slotRow').each(function(index, elm){
        var lastRaidFull = $(elm).find('.lastRaid img:nth-child(2)').hasClass('full');
        var lastRaid = $(elm).find('.lastRaid img:first-child').hasClass('iReport1');
        if(onlyFull) lastRaid = lastRaid && lastRaidFull;

        var id = $(this).attr('id').split("row-")[1];
        if(lastRaid){
          testForm += '"slot['+id+']": "on",';
          nbRaidsSend++;
        }else{
          if(!onlyFull){
            //une chance sur 6 de relancer sur un blessé
            if(Math.floor(Math.random() * 10)===4){
              testForm += '"slot['+id+']": "on",';
              nbRaidsSend++;
            }
          }
        }
        if(index === (list.find('.slotRow').length - 1)){
          testForm = testForm.substring(0, testForm.length - 1)
          testForm+= " }";
          var test = JSON.parse(testForm);
          request.post({url:'https://ts20.travian.fr/build.php?gid=16&tt=99', form: test, jar: j }, function(error,httpResponse,body){
            if(error) console.log("1----"+error);
            if(!error && httpResponse) Utils.debug("Envoi de la liste "+listName+" du village "+idVivi+" ("+nbRaidsSend+" pillages envoyes)");
          }).on('error', function(e) {
            console.log('2e tentative pour lancer la liste');
            request.post({url:'https://ts20.travian.fr/build.php?gid=16&tt=99', form: test, jar: j }, function(error,httpResponse,body){
              if(error) console.log("1----"+error);
              if(!error && httpResponse) Utils.debug("Envoi de la liste "+listName+" du village "+idVivi+" ("+nbRaidsSend+" pillages envoyes)");
            })
          })
        }
      })
    });
  },timer);
}

var getCcLeft = function(idVivi){
  var url = "https://ts20.travian.fr/dorf3.php?s=3";
  request({url, jar: j}, function (error, response, body) {
    const $ = cheerio.load(body);
    $('.crit').each(function(index, elm){
      console.log($(elm).attr('value'));
    });
  });
}
var test = function(){
}

var loadLists = function(cb){
  if(Config.lists){
    console.log('deja des listes')
  }else{
    console.log('pas encore de listes')
    var url = "https://ts20.travian.fr/build.php?tt=99&id=39";
    request({url, jar: j}, function (error, response, body) {
      const $ = cheerio.load(body);
      $('.crit').each(function(index, elm){
        // console.log($(elm).attr('value'));
      });
    });
  }
}

var sendRessources = function(viviSender, viviReceiver, repeat, arrayRessources){

};

var sendAttack = function(viviAtk, viviDef, modeAttack, arrayTroops){

}

// Gardez l'objet window dans une constante global, sinon la fenêtre sera fermée
// automatiquement quand l'objet JavaScript sera collecté par le ramasse-miettes.
let win

function createWindow () {
  // Créer le browser window.
  win = new BrowserWindow({
    width: 700,
    height: 450
  })

  // console.log(Config);
  // et charge le index.html de l'application.
  if(Config.name && Config.password){
    win.loadURL('https://ts20.travian.fr/')
  }else{
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  var timer; // current timeout id to clear
  function come(onlyFull){
    timer = 0;
    Utils.shuffleObject(Config.lists, function(list){
      var debug = '        LANCEMENT DES LISTES';
      debug += onlyFull ? ' - ONLY FULL' : '';
      Utils.debug(debug, true);
      Object.entries(list).forEach(([listName, idVivi]) => {
        var tmpTime = timer;
        sendList(listName, idVivi, tmpTime, onlyFull);
        timer += Config.timeBetweenListsSend;
      })
      if(!onlyFull && Utils.getRandomBoolean(Config.percentOfSendFulls)){
        var timeBis = (_.size(Config.lists) + 1) * Config.timeBetweenListsSend;
        setTimeout(function(){
          come(true);
        }, timeBis)
      }
    });
    // })
  }
  var time; // dynamic interval

  function repeat() {
    loop++;
    if(Config.troop && (loop%8==0 || loop==1 )){
      console.log('true');
      var nb = Math.floor(Math.random() * 300 + 220);
      setTimeout(function(){
        Village.formTroops(738, 'teuton', nb)
      },60000);
    }
    if(loop<Config.maxLoops){
      come(false);
      var time = Math.random() * Config.randomStepRaid + Config.minTimeRaid;
      timer = setTimeout(repeat, time);
      Utils.debug('Delai avant le prochain envoi: ' + Utils.millisToMinutesAndSeconds(time));
    }else{
      Utils.debug('    MAX LOOPS REACHED', true)
    }
  };


  win.webContents.on('did-finish-load', () => {
    let currentUrl = win.webContents.getURL();
    switch(currentUrl) {
      case Config.serverUrl:
      win.webContents.executeJavaScript(loginScript);
      break;
      //champs
      case Config.serverUrl + 'dorf1.php':
      activatedRaids = true;
      initializeRequest(function(){
        // sendList("list2449", '9474', 0, true);
        // test();
        setTimeout(repeat, 1500);
        // getCcLeft();
      });
      // setTimeout(repeat, 1500);
      break;
      //listes de pillage
      case Config.serverUrl + 'build.php?newdid=738&id=39&tt=99&gid=16':
      case Config.serverUrl + 'build.php?newdid=9474&id=39&tt=99&gid=16':
      if(activatedRaids === true){
        win.webContents.executeJavaScript(raidsScript);
      }
      break;
      //caserne
      case Config.serverUrl + 'build.php?newdid=738&id=33&gid=19':
      break;
      default:
      break;
    }
  });


  // Ouvre le DevTools.
  // win.webContents.openDevTools()

  // Émit lorsque la fenêtre est fermée.
  win.on('closed', () => {
    // Dé-référence l'objet window , normalement, vous stockeriez les fenêtres
    // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
    // où vous devez supprimer l'élément correspondant.
    win = null
  })
}

// Cette méthode sera appelée quant Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
// app.on('ready', function(){
//  Village.getStock(738, stock => {
//    console.log(stock)
//  })
//  return false;
// })
app.on('ready', createWindow)

// Quitte l'application quand toutes les fenêtres sont fermées.
app.on('window-all-closed', () => {
  // Sur macOS, il est commun pour une application et leur barre de menu
  // de rester active tant que l'utilisateur ne quitte pas explicitement avec Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
  if (win === null) {
    createWindow()
  }
})

// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.sender.send('asynchronous-reply', 'pong')
// })
//
// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })

//Sockets

ipcMain.on('parameters-submit', (event, parameters) => {
  parameters.forEach(function(elm, index){
    if(_.has(Config, elm.name)){
      if(elm.value == "true" || elm.value == "false"){
        Config[elm.name] = elm.name == "true" ? true : false;
      }else{
        Config[elm.name] = elm.value;
      }
    }
    if(index === parameters.length - 1){
      console.log(Config);
      win.loadURL('https://ts20.travian.fr/')
    }
  })

})

ipcMain.on('get-logs', function(event, arg) {
  event.returnValue = { name: Config.name, password: Config.password };
});
ipcMain.on('get-raids-settings', function(event, arg) {
  event.returnValue = { lists: Config.lists, currentList: currentList };
});
ipcMain.on('increment-currentList', function(event, arg) {
  currentList = currentList === _.size(Config.lists) - 1 ? 0 : currentList + 1;
  console.log('new currentList '+currentList)
});
ipcMain.on('writeLog', function(event, arg) {

});

var initializeRequest = function(cb){
  session.defaultSession.cookies.get({url: 'https://ts20.travian.fr/'}, (error, cookies) => {
    updateCookies(cookies, function(){
      // loadLists(cb);
      cb();
    });
  })
}

var updateCookies = function(cookies, cb){
  j = request.jar();
  cookies.forEach(function(elm, index){
    var cookie = request.cookie(elm.name + '=' + elm.value);
    var url = 'https://ts20.travian.fr/';
    j.setCookie(cookie, url);
    Config.jar = j;
    if(index === cookies.length - 1){
      cb();
    }
  })
}



// Dans ce fichier, vous pouvez inclure le reste de votre code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.

const Utils = require('./utils');
module.exports  = {
	serverUrl: "https://ts20.travian.fr/",
	name: "Noobpowaaa",
	password: "#Travian142857",
	timeBetweenListsSend: 5000,
	minTimeRaid: Utils.convertMinToMili(4),
	randomStepRaid: Utils.convertMinToMili(4),
	percentOfSendFulls: 99,
	maxLoops: 989,
	lists: {
		"list2466": 738, //Safe 3
		"list77": 738, //Safe
		"list2204": 738, //Teutons
		"list2449": 9474, //Sparte
	},
	ajaxToken: "f85ae910411ee02a6022281fa67113df",
	jar: undefined,
	troop: false
};

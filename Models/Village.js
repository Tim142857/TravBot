var VillageDAO = require('../DAL/VillageDAO.js')
module.exports = {
  getStock: (idVivi, cb) => {
    VillageDAO.getStock(idVivi, cb);
  },
  getStorage: (idVivi) => {
    VillageDAO.getStorage(idVivi, cb);
  },
  getProduction: (idVivi) => {

  },
  formTroops: (idVivi, troopType, nb) => {
    VillageDAO.formTroops(idVivi, troopType, nb);
  }
}

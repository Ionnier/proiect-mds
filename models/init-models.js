const DataTypes = require("sequelize").DataTypes;
const _boughtservices = require("./boughtservices");
const _services = require("./services");
const _users = require("./users");

function initModels(sequelize) {
  const boughtservices = _boughtservices(sequelize, DataTypes);
  const services = _services(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  services.belongsToMany(users, { as: 'idUserUsers', through: boughtservices, foreignKey: "idService", otherKey: "idUser" });
  users.belongsToMany(services, { as: 'idServiceServices', through: boughtservices, foreignKey: "idUser", otherKey: "idService" });
  boughtservices.belongsTo(services, { as: "idServiceService", foreignKey: "idService"});
  services.hasMany(boughtservices, { as: "boughtservices", foreignKey: "idService"});
  boughtservices.belongsTo(users, { as: "idUserUser", foreignKey: "idUser"});
  users.hasMany(boughtservices, { as: "boughtservices", foreignKey: "idUser"});

  return {
    boughtservices,
    services,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

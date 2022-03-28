const DataTypes = require("sequelize").DataTypes;
const _boughtservices = require("./boughtservices");
const _roomparticipants = require("./roomparticipants");
const _rooms = require("./rooms");
const _services = require("./services");
const _users = require("./users");

function initModels(sequelize) {
  const boughtservices = _boughtservices(sequelize, DataTypes);
  const roomparticipants = _roomparticipants(sequelize, DataTypes);
  const rooms = _rooms(sequelize, DataTypes);
  const services = _services(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  rooms.belongsToMany(users, { as: 'idUserUsersRoomparticipants', through: roomparticipants, foreignKey: "idRoom", otherKey: "idUser" });
  services.belongsToMany(users, { as: 'idUserUsers', through: boughtservices, foreignKey: "idService", otherKey: "idUser" });
  users.belongsToMany(rooms, { as: 'idRoomRooms', through: roomparticipants, foreignKey: "idUser", otherKey: "idRoom" });
  users.belongsToMany(services, { as: 'idServiceServices', through: boughtservices, foreignKey: "idUser", otherKey: "idService" });
  roomparticipants.belongsTo(rooms, { as: "idRoomRoom", foreignKey: "idRoom"});
  rooms.hasMany(roomparticipants, { as: "roomparticipants", foreignKey: "idRoom"});
  boughtservices.belongsTo(services, { as: "idServiceService", foreignKey: "idService"});
  services.hasMany(boughtservices, { as: "boughtservices", foreignKey: "idService"});
  boughtservices.belongsTo(users, { as: "idUserUser", foreignKey: "idUser"});
  users.hasMany(boughtservices, { as: "boughtservices", foreignKey: "idUser"});
  roomparticipants.belongsTo(users, { as: "idUserUser", foreignKey: "idUser"});
  users.hasMany(roomparticipants, { as: "roomparticipants", foreignKey: "idUser"});

  return {
    boughtservices,
    roomparticipants,
    rooms,
    services,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

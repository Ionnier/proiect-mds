const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return roomparticipants.init(sequelize, DataTypes);
}

class roomparticipants extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    idRoom: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rooms',
        key: 'id_room'
      },
      field: 'id_room'
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id_user'
      },
      field: 'id_user'
    },
    roomRole: {
      type: DataTypes.ENUM("Owner","Admin","Participant"),
      allowNull: false,
      defaultValue: "Participant",
      field: 'room_role'
    }
  }, {
    sequelize,
    tableName: 'roomparticipants',
    schema: 'public',
    timestamps: false
  });
  }
}

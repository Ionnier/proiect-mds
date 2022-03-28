const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return rooms.init(sequelize, DataTypes);
}

class rooms extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    idRoom: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_room'
    },
    roomName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "New Room",
      field: 'room_name'
    },
    roomCreationTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'room_creation_time'
    },
    roomImage: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'room_image'
    }
  }, {
    sequelize,
    tableName: 'rooms',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "rooms_pkey",
        unique: true,
        fields: [
          { name: "id_room" },
        ]
      },
    ]
  });
  }
}

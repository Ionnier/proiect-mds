const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return notificationendpoints.init(sequelize, DataTypes);
}

class notificationendpoints extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_user'
      },
      field: 'id_user'
    },
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'notificationendpoints',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "notificationendpoints_pkey",
        unique: true,
        fields: [
          { name: "endpoint" },
        ]
      },
    ]
  });
  }
}

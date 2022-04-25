const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return boughtservices.init(sequelize, DataTypes);
}

class boughtservices extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    idService: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'services',
        key: 'id_service'
      },
      field: 'id_service'
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id_user'
      },
      field: 'id_user'
    },
    serviceLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'service_level'
    },
    serviceLastCheck: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'service_last_check'
    },
    serviceImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'service_image'
    }
  }, {
    sequelize,
    tableName: 'boughtservices',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_bought_services",
        unique: true,
        fields: [
          { name: "id_service" },
          { name: "id_user" },
        ]
      },
    ]
  });
  }
}

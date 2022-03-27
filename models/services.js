const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return services.init(sequelize, DataTypes);
}

class services extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    idService: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_service'
    },
    serviceName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "services_service_name_key",
      field: 'service_name'
    },
    serviceDescription: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: "services_service_description_key",
      field: 'service_description'
    },
    serviceBasePrice: {
      type: DataTypes.REAL,
      allowNull: false,
      field: 'service_base_price'
    },
    serviceBaseValue: {
      type: DataTypes.REAL,
      allowNull: false,
      field: 'service_base_value'
    },
    servicePriceModifier: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: 'service_price_modifier'
    },
    serviceValueModifier: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      field: 'service_value_modifier'
    },
    serviceMaxLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      field: 'service_max_level'
    },
    serviceRefreshValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000,
      field: 'service_refresh_value'
    }
  }, {
    sequelize,
    tableName: 'services',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "services_pkey",
        unique: true,
        fields: [
          { name: "id_service" },
        ]
      },
      {
        name: "services_service_description_key",
        unique: true,
        fields: [
          { name: "service_description" },
        ]
      },
      {
        name: "services_service_name_key",
        unique: true,
        fields: [
          { name: "service_name" },
        ]
      },
    ]
  });
  }
}

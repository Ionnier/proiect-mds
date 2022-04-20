const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return randomguessoptions.init(sequelize, DataTypes);
}

class randomguessoptions extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    idRandomGuessGame: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'randomguessgames',
        key: 'id_random_guess_game'
      },
      field: 'id_random_guess_game'
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
    optionName: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      field: 'option_name'
    },
    winner: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'randomguessoptions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_rgo",
        unique: true,
        fields: [
          { name: "id_random_guess_game" },
          { name: "id_user" },
          { name: "option_name" },
        ]
      },
    ]
  });
  }
}

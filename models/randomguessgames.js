const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return randomguessgames.init(sequelize, DataTypes);
}

class randomguessgames extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    idRandomGuessGame: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_random_guess_game'
    },
    idRoom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id_room'
      },
      field: 'id_room'
    },
    randomGuessGameCreateDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'random_guess_game_create_date'
    },
    randomGuessGameFinishDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'random_guess_game_finish_date'
    }
  }, {
    sequelize,
    tableName: 'randomguessgames',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "randomguessgames_pkey",
        unique: true,
        fields: [
          { name: "id_random_guess_game" },
        ]
      },
      {
        name: "unique_active_game",
        unique: true,
        fields: [
          { name: "id_room" },
        ]
      },
    ]
  });
  }
}

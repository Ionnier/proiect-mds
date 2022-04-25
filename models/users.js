const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return users.init(sequelize, DataTypes);
}

class users extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    idUser: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_user'
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "users_user_name_key",
      field: 'user_name'
    },
    userEmail: {
      type: DataTypes.STRING(254),
      allowNull: false,
      unique: "users_user_email_key",
      field: 'user_email'
    },
    userFirstName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'user_first_name'
    },
    userLastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'user_last_name'
    },
    userPassword: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'user_password'
    },
    userCredits: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'user_credits'
    },
    notificationGameFinished: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'notification_game_finished'
    },
    notificationGameCreated: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'notification_game_created'
    },
    notificationPointsRefresh: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'notification_points_refresh'
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "users_user_email_key",
        unique: true,
        fields: [
          { name: "user_email" },
        ]
      },
      {
        name: "users_user_name_key",
        unique: true,
        fields: [
          { name: "user_name" },
        ]
      },
    ]
  });
  }
}

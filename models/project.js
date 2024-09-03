const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define(
  "Project",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    teamId: {
      type: DataTypes.INTEGER,
      references: {
        model: "teams",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "projects",
    timestamps: false,
  },
);

module.exports = Project;

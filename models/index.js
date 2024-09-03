const sequelize = require("../config/database");
const User = require("./user");
const Team = require("./team");
const Project = require("./project");
const TeamMember = require("./teamMember");

// relacionamento entre os modelos
User.hasMany(Team, { foreignKey: "leaderId", as: "TeamsLed" });
Team.belongsTo(User, { as: "Leader", foreignKey: "leaderId" });

User.belongsToMany(Team, {
  through: TeamMember,
  foreignKey: "userId",
  as: "Teams",
});
Team.belongsToMany(User, {
  through: TeamMember,
  foreignKey: "teamId",
  as: "Members",
});

Team.hasMany(Project, { foreignKey: "teamId" });
Project.belongsTo(Team, { foreignKey: "teamId" });

module.exports = {
  sequelize,
  User,
  Team,
  Project,
  TeamMember,
};
